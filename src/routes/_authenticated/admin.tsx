import { createFileRoute, useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminOverview,
  updateProcessedOrder,
  upsertCustomer,
  deleteCustomer,
  type CustomerRow,
  type ProcessedOrderRow,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin – Kolysa" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const ORDER_STATUSES = ["ny", "påbörjad", "levererad", "återbetald"];
const CUSTOMER_STATUSES = ["ny", "kontaktad", "pågår", "klar", "arkiverad"];

function formatAmount(cents: number | null, currency: string | null) {
  if (cents == null) return "–";
  const value = cents / 100;
  return `${value.toLocaleString("sv-SE")} ${(currency ?? "sek").toUpperCase()}`;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "–";
  return new Date(iso).toLocaleString("sv-SE");
}

function AdminPage() {
  const navigate = useNavigate();
  const router = useRouter();

  const query = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => getAdminOverview(),
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (query.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-subtle">Laddar…</p>
      </main>
    );
  }

  if (query.error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-serif text-2xl text-ink">Något gick fel</h1>
        <p className="mt-2 text-sm text-red-700">
          {query.error instanceof Error ? query.error.message : "Okänt fel"}
        </p>
        <button onClick={signOut} className="mt-6 text-sm underline">
          Logga ut
        </button>
      </main>
    );
  }

  const data = query.data!;

  if (!data.isAdmin) {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-serif text-3xl text-ink">Ingen admin-behörighet</h1>
        <p className="mt-3 text-sm text-subtle">
          Ditt konto är inloggat men saknar admin-rollen. Be den som äger
          projektet att lägga till ditt användar-ID i tabellen{" "}
          <code className="rounded bg-secondary px-1">user_roles</code> med
          rollen <code className="rounded bg-secondary px-1">admin</code>.
        </p>
        <button
          onClick={signOut}
          className="mt-6 rounded-[6px] border border-rule px-4 py-2 text-sm"
        >
          Logga ut
        </button>
      </main>
    );
  }

  const refresh = () => router.invalidate() && query.refetch();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-subtle">Kolysa</p>
          <h1 className="mt-1 font-serif text-4xl text-ink">Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm underline text-subtle">
            Till sajten
          </Link>
          <button
            onClick={signOut}
            className="rounded-[6px] border border-rule px-3 py-1.5 text-sm"
          >
            Logga ut
          </button>
        </div>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Kampanjstatus"
          value={data.ladder.campaign_active ? "Aktiv" : "Avslutad"}
        />
        <StatCard
          label="Aktuellt steg"
          value={`${Math.min(data.ladder.current_step, data.ladder.total_steps)} / ${data.ladder.total_steps}`}
          sub={`Pris nu: ${data.ladder.current_price} kr`}
        />
        <StatCard
          label="Antal ladder-ordrar"
          value={String(data.ladder.orders_count)}
          sub={
            data.ladder.next_price != null
              ? `Nästa pris: ${data.ladder.next_price} kr`
              : "Ordinarie pris gäller"
          }
        />
        <StatCard
          label="Processed orders"
          value={String(data.processedCount)}
          sub={
            data.latestOrder
              ? `Senast: ${formatDate(data.latestOrder.processed_at)}`
              : "Inga ännu"
          }
        />
      </section>

      <OrdersSection orders={data.orders} onChanged={refresh} />
      <CustomersSection customers={data.customers} onChanged={refresh} />
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-[8px] border border-rule bg-paper p-5">
      <p className="text-xs uppercase tracking-wide text-subtle">{label}</p>
      <p className="mt-2 font-serif text-2xl text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-subtle">{sub}</p>}
    </div>
  );
}

function OrdersSection({
  orders,
  onChanged,
}: {
  orders: ProcessedOrderRow[];
  onChanged: () => void;
}) {
  const mutation = useMutation({
    mutationFn: (input: { order_id: string; status?: string; notes?: string | null }) =>
      updateProcessedOrder({ data: input }),
    onSuccess: onChanged,
  });

  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl text-ink">
        Behandlade beställningar
      </h2>
      <p className="mt-1 text-sm text-subtle">
        En rad per Stripe checkout-session. Redigera status och anteckningar
        direkt i tabellen.
      </p>

      <div className="mt-6 overflow-x-auto rounded-[8px] border border-rule">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              <Th>Session ID</Th>
              <Th>Datum</Th>
              <Th>E-post</Th>
              <Th>Sajt</Th>
              <Th>Paket</Th>
              <Th>Steg</Th>
              <Th>Belopp</Th>
              <Th>Status</Th>
              <Th>Anteckning</Th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-subtle">
                  Inga beställningar ännu.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.order_id} className="border-t border-rule align-top">
                <Td>
                  <span className="font-mono text-xs" title={o.order_id}>
                    {o.order_id.slice(0, 18)}…
                  </span>
                </Td>
                <Td>{formatDate(o.processed_at)}</Td>
                <Td>{o.customer_email ?? "–"}</Td>
                <Td>{o.website_url ?? "–"}</Td>
                <Td>{o.package_slug ?? "–"}</Td>
                <Td>{o.ladder_step ?? "–"}</Td>
                <Td>{formatAmount(o.amount_total, o.currency)}</Td>
                <Td>
                  <select
                    defaultValue={o.status}
                    onChange={(e) =>
                      mutation.mutate({
                        order_id: o.order_id,
                        status: e.target.value,
                      })
                    }
                    className="rounded border border-rule bg-paper px-2 py-1 text-xs"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Td>
                <Td>
                  <input
                    defaultValue={o.notes ?? ""}
                    placeholder="–"
                    onBlur={(e) => {
                      if ((e.target.value || "") !== (o.notes ?? "")) {
                        mutation.mutate({
                          order_id: o.order_id,
                          notes: e.target.value || null,
                        });
                      }
                    }}
                    className="w-56 rounded border border-rule bg-paper px-2 py-1 text-xs"
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CustomersSection({
  customers,
  onChanged,
}: {
  customers: CustomerRow[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<Partial<CustomerRow> | null>(null);

  const saveMutation = useMutation({
    mutationFn: (input: Partial<CustomerRow>) =>
      upsertCustomer({
        data: {
          id: input.id,
          name: input.name ?? null,
          email: input.email ?? null,
          website_url: input.website_url ?? null,
          package_slug: input.package_slug ?? null,
          status: input.status ?? "ny",
          notes: input.notes ?? null,
        },
      }),
    onSuccess: () => {
      setEditing(null);
      onChanged();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCustomer({ data: { id } }),
    onSuccess: onChanged,
  });

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-ink">Kunder</h2>
          <p className="mt-1 text-sm text-subtle">
            Automatiskt insamlade från betalningar samt manuellt tillagda.
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({
              status: "ny",
              source: "manual",
            })
          }
          className="rounded-[6px] bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Lägg till kund
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[8px] border border-rule">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              <Th>Namn</Th>
              <Th>E-post</Th>
              <Th>Sajt</Th>
              <Th>Paket</Th>
              <Th>Status</Th>
              <Th>Källa</Th>
              <Th>Skapad</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-subtle">
                  Inga kunder ännu.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-rule">
                <Td>{c.name ?? "–"}</Td>
                <Td>{c.email ?? "–"}</Td>
                <Td>{c.website_url ?? "–"}</Td>
                <Td>{c.package_slug ?? "–"}</Td>
                <Td>{c.status}</Td>
                <Td>{c.source}</Td>
                <Td>{formatDate(c.created_at)}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button
                      className="text-xs underline"
                      onClick={() => setEditing(c)}
                    >
                      Ändra
                    </button>
                    <button
                      className="text-xs text-red-700 underline"
                      onClick={() => {
                        if (confirm(`Ta bort ${c.name || c.email || "kund"}?`))
                          deleteMutation.mutate(c.id);
                      }}
                    >
                      Ta bort
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg rounded-[8px] border border-rule bg-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-xl text-ink">
              {editing.id ? "Redigera kund" : "Ny kund"}
            </h3>
            <div className="mt-4 space-y-3">
              <Field
                label="Namn"
                value={editing.name ?? ""}
                onChange={(v) => setEditing({ ...editing, name: v })}
              />
              <Field
                label="E-post"
                type="email"
                value={editing.email ?? ""}
                onChange={(v) => setEditing({ ...editing, email: v })}
              />
              <Field
                label="Webbadress"
                value={editing.website_url ?? ""}
                onChange={(v) => setEditing({ ...editing, website_url: v })}
              />
              <Field
                label="Paket (slug)"
                value={editing.package_slug ?? ""}
                onChange={(v) => setEditing({ ...editing, package_slug: v })}
                placeholder="rapport / rapport-plus / bevakning"
              />
              <div>
                <label className="block text-xs uppercase tracking-wide text-subtle">
                  Status
                </label>
                <select
                  value={editing.status ?? "ny"}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-rule bg-paper px-3 py-2"
                >
                  {CUSTOMER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-subtle">
                  Anteckningar
                </label>
                <textarea
                  rows={4}
                  value={editing.notes ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, notes: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-rule bg-paper px-3 py-2"
                />
              </div>
            </div>
            {saveMutation.error && (
              <p className="mt-3 text-sm text-red-700">
                {saveMutation.error instanceof Error
                  ? saveMutation.error.message
                  : "Kunde inte spara"}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="rounded-[6px] border border-rule px-4 py-2 text-sm"
              >
                Avbryt
              </button>
              <button
                onClick={() => saveMutation.mutate(editing)}
                disabled={saveMutation.isPending}
                className="rounded-[6px] bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60"
              >
                {saveMutation.isPending ? "Sparar…" : "Spara"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-subtle">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border border-rule bg-paper px-3 py-2"
      />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-subtle">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 text-ink">{children}</td>;
}
