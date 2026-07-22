import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { computeLadderStatus, type LadderStatus } from "./ladder-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertAdmin(context: any) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Kunde inte verifiera behörighet");
  if (!data) throw new Error("Åtkomst nekad");
}


export type ProcessedOrderRow = {
  order_id: string;
  processed_at: string;
  updated_at: string | null;
  customer_email: string | null;
  website_url: string | null;
  company_name: string | null;
  package_slug: string | null;
  amount_total: number | null;
  currency: string | null;
  ladder_step: number | null;
  status: string;
  notes: string | null;
};

export type CustomerRow = {
  id: string;
  name: string | null;
  email: string | null;
  website_url: string | null;
  package_slug: string | null;
  status: string;
  notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
};

export type AdminOverview = {
  isAdmin: boolean;
  ladder: LadderStatus;
  latestOrder: ProcessedOrderRow | null;
  processedCount: number;
  orders: ProcessedOrderRow[];
  customers: CustomerRow[];
};

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminOverview> => {
    const { data: isAdminRaw } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const isAdmin = Boolean(isAdminRaw);
    if (!isAdmin) {
      return {
        isAdmin: false,
        ladder: computeLadderStatus(0),
        latestOrder: null,
        processedCount: 0,
        orders: [],
        customers: [],
      };
    }

    const [{ data: ladderRow }, ordersRes, customersRes, countRes] =
      await Promise.all([
        context.supabase
          .from("ladder_state")
          .select("orders_count")
          .eq("id", 1)
          .maybeSingle(),
        context.supabase
          .from("processed_orders")
          .select(
            "order_id, processed_at, updated_at, customer_email, website_url, company_name, package_slug, amount_total, currency, ladder_step, status, notes",
          )
          .order("processed_at", { ascending: false })
          .limit(200),
        context.supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200),
        context.supabase
          .from("processed_orders")
          .select("order_id", { count: "exact", head: true }),
      ]);

    const orders = (ordersRes.data ?? []) as ProcessedOrderRow[];
    const customers = (customersRes.data ?? []) as CustomerRow[];
    const ladder = computeLadderStatus(ladderRow?.orders_count ?? 0);

    return {
      isAdmin: true,
      ladder,
      latestOrder: orders[0] ?? null,
      processedCount: countRes.count ?? orders.length,
      orders,
      customers,
    };
  });

const updateOrderSchema = z.object({
  order_id: z.string().min(1),
  status: z.string().min(1).max(40).optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const updateProcessedOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateOrderSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const patch: { status?: string; notes?: string | null } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.notes !== undefined) patch.notes = data.notes;

    const { error } = await context.supabase
      .from("processed_orders")
      .update(patch)
      .eq("order_id", data.order_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const customerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().max(120).nullable().optional(),
  email: z.string().email().max(255).nullable().optional().or(z.literal("")),
  website_url: z.string().max(500).nullable().optional(),
  package_slug: z.string().max(40).nullable().optional(),
  status: z.string().max(40).optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const upsertCustomer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => customerSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const row = {
      name: data.name || null,
      email: data.email ? data.email : null,
      website_url: data.website_url || null,
      package_slug: data.package_slug || null,
      status: data.status || "ny",
      notes: data.notes || null,
    };
    if (data.id) {
      const { error } = await context.supabase
        .from("customers")
        .update(row)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    const { data: inserted, error } = await context.supabase
      .from("customers")
      .insert({ ...row, source: "manual" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: inserted.id };
  });

export const deleteCustomer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("customers")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
