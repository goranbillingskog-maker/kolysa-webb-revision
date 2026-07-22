import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PACKAGES, type PackageId } from "@/components/package-card";

// ---------------------------------------------------------------------------
// Lemon Squeezy checkout-länkar. Klistra in de skarpa URL:erna här när de
// finns – ingenting annat behöver ändras.
// ---------------------------------------------------------------------------
const PAYMENT_URL_REPORT = "https://example.lemonsqueezy.com/checkout/rapport";
const PAYMENT_URL_PLUS = "https://example.lemonsqueezy.com/checkout/rapport-plus-genomgang";
const PAYMENT_URL_MONITOR = "https://example.lemonsqueezy.com/checkout/manadsovervakning";

const PAYMENT_URLS: Record<PackageId, string> = {
  report: PAYMENT_URL_REPORT,
  plus: PAYMENT_URL_PLUS,
  monitor: PAYMENT_URL_MONITOR,
};

type Search = { paket?: PackageId };

export const Route = createFileRoute("/bestall")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const p = search.paket;
    if (p === "report" || p === "plus" || p === "monitor") return { paket: p };
    return {};
  },
  head: () => ({
    meta: [
      { title: "Beställ granskning av din hemsida – Kolysa" },
      {
        name: "description",
        content:
          "Beställ en manuell granskning av din hemsida. Rapport med betyg och åtgärder inom 24 timmar.",
      },
      { property: "og:title", content: "Beställ granskning – Kolysa" },
      {
        property: "og:description",
        content:
          "En manuell webb-revision av Göran Billingskog. Rapport med betyg och åtgärder inom 24 timmar.",
      },
      { property: "og:url", content: "/bestall" },
    ],
    links: [{ rel: "canonical", href: "/bestall" }],
  }),
  component: BestallPage,
});

function BestallPage() {
  const { paket } = Route.useSearch();
  const [selected, setSelected] = useState<PackageId>(paket ?? "plus");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Ingen backend – vi skickar bara vidare kunden till betalning.
    window.location.href = PAYMENT_URLS[selected];
  }

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main id="main">
        <section className="mx-auto max-w-3xl px-5 pb-6 pt-16 sm:px-8 md:pt-20">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Beställning
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
            Beställ din granskning.
          </h1>
          <p className="prose-measure mt-5 text-[17px] text-ink/85">
            Fyll i webbadressen till sajten du vill att jag granskar. Rapporten är i din
            mejl inom 24 timmar (vardagar).
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
          <form onSubmit={onSubmit} className="mt-10 space-y-10">
            {/* Paketväljare */}
            <fieldset>
              <legend className="font-serif text-xl text-ink">Välj paket</legend>
              <div className="mt-4 grid gap-3">
                {PACKAGES.map((p) => {
                  const isSelected = selected === p.id;
                  return (
                    <label
                      key={p.id}
                      className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 rounded-[6px] border p-4 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/[0.04]"
                          : "border-rule hover:border-ink/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paket"
                        value={p.id}
                        checked={isSelected}
                        onChange={() => setSelected(p.id)}
                        className="mt-1.5 h-4 w-4 accent-[var(--color-primary)]"
                      />
                      <div className="min-w-0">
                        <p className="font-serif text-lg text-ink">{p.name}</p>
                        <p className="mt-1 text-sm text-subtle">{p.tagline}</p>
                      </div>
                      <p className="shrink-0 font-serif text-lg tabular-nums text-ink">
                        {p.price}
                      </p>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Fält */}
            <fieldset className="space-y-5">
              <legend className="font-serif text-xl text-ink">Dina uppgifter</legend>

              <Field
                id="url"
                label="Webbadress"
                required
                type="url"
                placeholder="https://mittforetag.se"
                autoComplete="url"
              />
              <Field
                id="company"
                label="Företagsnamn"
                autoComplete="organization"
              />
              <Field
                id="email"
                label="E-post"
                required
                type="email"
                placeholder="du@företaget.se"
                autoComplete="email"
              />

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-ink">
                  Något du särskilt vill att jag tittar på?{" "}
                  <span className="font-normal text-subtle">(valfritt)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="mt-2 block w-full rounded-[6px] border border-rule bg-paper px-3 py-2.5 text-[15px] text-ink placeholder:text-subtle/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="T.ex. ”Kontaktformuläret verkar strula i Safari” eller ”Vi ska byta bokningssystem – vad ska vi tänka på?”"
                />
              </div>
            </fieldset>

            <div className="flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm text-subtle">
                Du betalar säkert med kort. Rapporten levereras av mig personligen inom
                24 timmar.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-[6px] bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Till betalning
              </button>
            </div>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  id,
  label,
  required,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-primary" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 block w-full rounded-[6px] border border-rule bg-paper px-3 py-2.5 text-[15px] text-ink placeholder:text-subtle/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
