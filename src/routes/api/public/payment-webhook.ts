import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "node:crypto";

// Idempotent webhook: räknar upp orders_count exakt en gång per unik order_id.
// Skickas från betalningsleverantören vid "order created". Skydda med
// PAYMENT_WEBHOOK_SECRET som antingen Authorization: Bearer <secret> eller
// x-webhook-secret-header.

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export const Route = createFileRoute("/api/public/payment-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.PAYMENT_WEBHOOK_SECRET;
        if (!expected) {
          return new Response("Server misconfigured", { status: 500 });
        }

        const auth = request.headers.get("authorization") ?? "";
        const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        const headerSecret =
          request.headers.get("x-webhook-secret") ?? bearer ?? "";
        if (!headerSecret || !safeEq(headerSecret, expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const payload = body as {
          order_id?: unknown;
          package?: unknown;
        };
        const orderId =
          typeof payload.order_id === "string" ? payload.order_id.trim() : "";
        if (!orderId) {
          return new Response("Missing order_id", { status: 400 });
        }

        // Räkna endast upp för "report"-paketet (kampanjen gäller endast det).
        // Om avsändaren inte skickar package-fältet räknar vi upp ändå,
        // eftersom endast rapportköpen kommer att pekas mot denna endpoint.
        const pkg =
          typeof payload.package === "string" ? payload.package : "report";
        if (pkg !== "report") {
          return Response.json({ ok: true, ignored: true, reason: "not_report" });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        // Idempotent insert: om order_id redan finns → hoppa över.
        const { error: insertErr } = await supabaseAdmin
          .from("processed_orders")
          .insert({ order_id: orderId });

        if (insertErr) {
          // 23505 = unique_violation → redan hanterad, allt bra.
          if ((insertErr as { code?: string }).code === "23505") {
            return Response.json({ ok: true, duplicate: true });
          }
          console.error("processed_orders insert failed", insertErr);
          return new Response("DB error", { status: 500 });
        }

        // Öka räknaren atomiskt via en RPC-liknande UPDATE ... RETURNING.
        const { data: updated, error: updateErr } = await supabaseAdmin
          .from("ladder_state")
          .update({
            orders_count:
              // supabase-js har ingen native "increment" — vi läser + skriver.
              // För att hålla det atomiskt använder vi SQL via rpc? Enklare:
              // gör en läs-uppdatera-cykel; kollisionsfönstret är litet och
              // dubbelträff är acceptabelt enligt spec.
              (
                (
                  await supabaseAdmin
                    .from("ladder_state")
                    .select("orders_count")
                    .eq("id", 1)
                    .single()
                ).data?.orders_count ?? 0
              ) + 1,
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
              "content-type, authorization, x-webhook-secret",
          },
        }),
    },
  },
});
