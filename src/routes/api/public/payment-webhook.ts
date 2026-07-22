import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { LADDER_PRICE_IDS } from "@/lib/ladder-config";

// Stripe-webhook för kampanjräknaren.
// Verifierar Stripe-Signature (t=..,v1=..) mot råa request-bodyn med
// PAYMENT_WEBHOOK_SECRET (Stripe webhook signing secret, whsec_...).
// Bearbetar endast checkout.session.completed. Idempotent per session-id.

const SIGNATURE_TOLERANCE_SECONDS = 60 * 5;

function safeEqHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ab.length !== bb.length || ab.length === 0) return false;
  return timingSafeEqual(ab, bb);
}

function parseStripeSignature(header: string): { t?: string; v1: string[] } {
  const parts = header.split(",");
  const result: { t?: string; v1: string[] } = { v1: [] };
  for (const part of parts) {
    const [k, v] = part.split("=");
    if (!k || !v) continue;
    if (k === "t") result.t = v;
    else if (k === "v1") result.v1.push(v);
  }
  return result;
}

function verifyStripeSignature(
  rawBody: string,
  header: string,
  secret: string,
): boolean {
  const { t, v1 } = parseStripeSignature(header);
  if (!t || v1.length === 0) return false;
  const timestamp = Number(t);
  if (!Number.isFinite(timestamp)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("hex");
  return v1.some((sig) => safeEqHex(sig, expected));
}

type StripeCheckoutSession = {
  id?: string;
  metadata?: Record<string, string> | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  amount_total?: number | null;
  currency?: string | null;
  line_items?: {
    data?: Array<{ price?: { id?: string } | null }>;
  } | null;
};


type StripeEvent = {
  type?: string;
  data?: { object?: StripeCheckoutSession };
};

async function fetchLinePriceIds(sessionId: string): Promise<string[]> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(
        sessionId,
      )}/line_items?limit=100`,
      { headers: { Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: Array<{ price?: { id?: string } | null }>;
    };
    return (json.data ?? [])
      .map((li) => li.price?.id)
      .filter((id): id is string => typeof id === "string");
  } catch (err) {
    console.error("stripe line_items fetch failed", err);
    return [];
  }
}

export const Route = createFileRoute("/api/public/payment-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PAYMENT_WEBHOOK_SECRET;
        if (!secret) {
          return new Response("Server misconfigured", { status: 500 });
        }

        const signature = request.headers.get("stripe-signature");
        if (!signature) {
          return new Response("Missing signature", { status: 401 });
        }

        const rawBody = await request.text();
        if (!verifyStripeSignature(rawBody, signature, secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: StripeEvent;
        try {
          event = JSON.parse(rawBody) as StripeEvent;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        if (event.type !== "checkout.session.completed") {
          return Response.json({ ok: true, ignored: true, reason: "event_type" });
        }

        const session = event.data?.object;
        const sessionId = typeof session?.id === "string" ? session.id : "";
        if (!sessionId) {
          return Response.json({ ok: true, ignored: true, reason: "no_session_id" });
        }

        // Hitta price ids: först från metadata, sedan från inbäddade line_items,
        // sist genom att hämta line_items via Stripe API om nyckel finns.
        const priceIds = new Set<string>();
        const metaPrice = session?.metadata?.price_id;
        if (typeof metaPrice === "string" && metaPrice) priceIds.add(metaPrice);
        for (const li of session?.line_items?.data ?? []) {
          if (typeof li.price?.id === "string") priceIds.add(li.price.id);
        }
        if (priceIds.size === 0) {
          for (const id of await fetchLinePriceIds(sessionId)) priceIds.add(id);
        }

        const isLadderOrder = Array.from(priceIds).some((id) =>
          LADDER_PRICE_IDS.includes(id),
        );
        if (!isLadderOrder) {
          return Response.json({ ok: true, ignored: true, reason: "not_ladder" });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const { data: currentLadder } = await supabaseAdmin
          .from("ladder_state")
          .select("orders_count")
          .eq("id", 1)
          .maybeSingle();
        const nextStep = (currentLadder?.orders_count ?? 0) + 1;

        const customerEmail =
          session?.customer_details?.email ?? session?.customer_email ?? null;
        const websiteUrl = session?.metadata?.website_url ?? null;
        const companyName = session?.metadata?.company_name ?? null;
        const packageSlug = session?.metadata?.package_slug ?? "rapport";

        const { error: insertErr } = await supabaseAdmin
          .from("processed_orders")
          .insert({
            order_id: sessionId,
            customer_email: customerEmail,
            website_url: websiteUrl,
            company_name: companyName,
            package_slug: packageSlug,
            amount_total: session?.amount_total ?? null,
            currency: session?.currency ?? null,
            ladder_step: nextStep,
            status: "ny",
          });


        if (insertErr) {
          if ((insertErr as { code?: string }).code === "23505") {
            return Response.json({ ok: true, duplicate: true });
          }
          console.error("processed_orders insert failed", insertErr);
          return new Response("DB error", { status: 500 });
        }

        const { data: updated, error: updateErr } = await supabaseAdmin
          .from("ladder_state")
          .update({
            orders_count: nextStep,
            updated_at: new Date().toISOString(),
          })
          .eq("id", 1)
          .select("orders_count")
          .single();


        if (updateErr) {
          console.error("ladder_state update failed", updateErr);
          return new Response("DB error", { status: 500 });
        }

        return Response.json({
          ok: true,
          orders_count: updated?.orders_count ?? null,
        });
      },

      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "POST, OPTIONS",
            "access-control-allow-headers":
              "content-type, stripe-signature",
          },
        }),
    },
  },
});
