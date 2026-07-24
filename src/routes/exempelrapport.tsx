import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Signature } from "@/components/signature";
import { ScoreBar } from "@/components/score-bar";
import { FindingItem } from "@/components/finding-item";
import { getReportContent } from "@/lib/report.functions";

export const Route = createFileRoute("/exempelrapport")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["report-content"],
      queryFn: () => getReportContent(),
    });
  },
  head: () => ({
    meta: [
      { title: "Exempelrapport – så ser en granskning från Kolysa ut" },
      {
        name: "description",
        content:
          "Se exakt vad du får: en exempelrapport från en AI-analys som jag granskar och prioriterar innan den skickas. Betyg inom sju områden och konkreta rekommendationer.",
      },
      { property: "og:title", content: "Exempelrapport – Kolysa" },
      {
        property: "og:description",
        content:
          "En exempelrapport från en webb-revision: AI-driven analys, granskad av mig innan den skickas.",
      },
      { property: "og:url", content: "/exempelrapport" },
    ],
    links: [{ rel: "canonical", href: "/exempelrapport" }],
  }),
  component: ExempelrapportPage,
});

const DIMENSIONS = [
  { name: "Prestanda", value: 54 },
  { name: "SEO", value: 68 },
  { name: "Tillgänglighet", value: 47 },
  { name: "Innehåll", value: 72 },
  { name: "Konvertering", value: 58 },
  { name: "Teknik", value: 63 },
  { name: "Säkerhet", value: 65 },
];

function ExempelrapportPage() {
  const { data: report } = useSuspenseQuery({
    queryKey: ["report-content"],
    queryFn: () => getReportContent(),
  });

  const hasCustomContent = report.content.trim().length > 0;

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main id="main">
        <section className="mx-auto max-w-4xl px-5 pb-14 pt-16 sm:px-8 md:pt-20">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Exempelrapport
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
            Så här ser din rapport ut.
          </h1>
          <div className="prose-measure mt-6 space-y-4 text-[17px] text-ink/85">
            <p>
              Här är en rapport för ett fiktivt företag. AI:n har analyserat sajten
              mot alla sju områden – jag har sedan gått igenom fynden, prioriterat
              det som faktiskt spelar roll och skrivit åtgärderna i klartext.
            </p>
            <p>
              Om något står som kritiskt är det för att jag har bedömt det som
              kritiskt – inte för att en maskin råkade flagga det.
            </p>
          </div>
          <Signature className="mt-5 text-lg" />
        </section>

        {hasCustomContent ? (
          <section className="mx-auto max-w-5xl px-5 sm:px-8">
            {report.format === "html" ? (
              <ReportIframe html={report.html} />
            ) : (
              <article
                className="report-body rounded-[6px] border border-rule bg-paper p-6 sm:p-10"
                dangerouslySetInnerHTML={{ __html: report.html }}
              />
            )}
          </section>
        ) : (
          <StaticReport />
        )}


        {/* CTA */}
        <section className="mx-auto mt-16 max-w-4xl px-5 sm:px-8">
          <div className="grid gap-6 border-t border-ink/80 pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h2 className="font-serif text-3xl text-ink sm:text-4xl">
                Vill du se samma sak för din sajt?
              </h2>
              <p className="mt-3 text-[15px] text-subtle">
                Rapporten är i din mejl inom 24 timmar (vardagar).
              </p>
            </div>
            <Link
              to="/bestall"
              className="inline-flex items-center justify-center rounded-[6px] bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Beställ granskning
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ReportIframe({ html }: { html: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const resize = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc?.body) {
          setHeight(doc.documentElement.scrollHeight + 4);
        }
      } catch {
        /* ignore */
      }
    };
    iframe.addEventListener("load", resize);
    const interval = window.setInterval(resize, 500);
    return () => {
      iframe.removeEventListener("load", resize);
      window.clearInterval(interval);
    };
  }, [html]);

  return (
    <iframe
      ref={ref}
      title="Exempelrapport"
      sandbox="allow-same-origin"
      srcDoc={html}
      className="w-full rounded-[6px] border border-rule bg-white"
      style={{ height }}
    />
  );
}

function StaticReport() {
  return (


    <section className="mx-auto max-w-4xl px-5 sm:px-8">
      <article className="rounded-[6px] border border-rule bg-paper p-6 sm:p-10">
        <header className="border-b border-ink/80 pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">
            Webb-revision
          </p>
          <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
            Måleri Exempel AB
          </h2>
          <dl className="mt-4 grid gap-2 text-sm text-subtle sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide">Granskad sajt</dt>
              <dd className="mt-1 text-ink">maleriexempel.se</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Utförd</dt>
              <dd className="mt-1 text-ink">12 mars 2026</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Av</dt>
              <dd className="mt-1 text-ink">Göran Billingskog</dd>
            </div>
          </dl>
        </header>

        {/* Totalpoäng */}
        <div className="mt-8 grid gap-8 border-b border-rule pb-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">
              Totalpoäng
            </p>
            <p className="mt-2 font-serif text-7xl leading-none text-ink">
              61<span className="text-3xl text-subtle">/100</span>
            </p>
          </div>
          <p className="text-[15px] text-ink/80 md:pb-3">
            Solid grund, men flera brister i tillgänglighet och sidprestanda drar ner
            helhetsbetyget. Ingen enskild sak är katastrofal – det är summan av
            småsaker. AI:n fångade det tekniska; det här är min sammanfattning av
            vad som är värt att prioritera.
          </p>
        </div>

        {/* Poäng per område */}
        <div className="mt-8">
          <h3 className="font-serif text-xl text-ink">Betyg per område</h3>
          <div className="mt-3 divide-y divide-rule/70">
            {DIMENSIONS.map((d) => (
              <ScoreBar key={d.name} label={d.name} value={d.value} />
            ))}
          </div>
        </div>

        {/* Findings: Tillgänglighet */}
        <div className="mt-10">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/80 pb-2">
            <h3 className="font-serif text-xl text-ink">Tillgänglighet</h3>
            <span className="font-serif tabular-nums text-ink/70">47/100</span>
          </div>
          <ul className="mt-2">
            <FindingItem
              severity="Kritiskt"
              title="Kontaktformuläret går inte att fylla i med tangentbord"
              body="Fältet ”Meddelande” fångar aldrig fokus när jag tabbar mig igenom sidan. En besökare som använder skärmläsare eller tangentbord kan inte skicka en förfrågan alls."
            />
            <FindingItem
              severity="Kritiskt"
              title="Låg kontrast på grå brödtext mot vit bakgrund"
              body="Färgkombinationen på startsidans intro (#9A9A9A på vitt) klarar inte WCAG AA. Många läsare över 50 år kommer inte att kunna läsa texten bekvämt."
            />
            <FindingItem
              severity="Bör åtgärdas"
              title="Bilder i referensgalleriet saknar alt-text"
              body="17 av 24 bilder har tomma alt-attribut. Skärmläsare läser bara upp ”image” istället för att beskriva ert arbete."
            />
          </ul>
        </div>

        {/* Findings: SEO */}
        <div className="mt-10">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/80 pb-2">
            <h3 className="font-serif text-xl text-ink">SEO</h3>
            <span className="font-serif tabular-nums text-ink/70">68/100</span>
          </div>
          <ul className="mt-2">
            <FindingItem
              severity="Bör åtgärdas"
              title="Startsidans title-tagg säger bara ”Hem – Måleri Exempel AB”"
              body="Ni missar chansen att fånga sökningar som ”målare Västerås” eller ”fasadmålning Mälardalen”. Byt till en title som beskriver vad ni gör och var."
            />
            <FindingItem
              severity="Bör åtgärdas"
              title="Sidorna om era tjänster saknar egna meta-beskrivningar"
              body="Google fyller i något själv – ofta en slumpad mening från sidfoten. En skräddarsydd beskrivning per tjänstsida höjer klickfrekvensen i sökresultaten."
            />
            <FindingItem
              severity="Bra"
              title="Företagsuppgifterna är korrekt strukturerade"
              body="Organisationsnummer, adress och öppettider ligger som schema.org LocalBusiness. Bra jobbat – det hjälper er att synas i Google Maps."
            />
          </ul>
        </div>

        <p className="mt-10 text-sm italic text-subtle">
          (I den fullständiga rapporten går jag igenom alla sju områden på samma sätt.)
        </p>
      </article>
    </section>
  );
}
