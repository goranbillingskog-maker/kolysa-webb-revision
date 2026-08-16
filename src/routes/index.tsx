import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { UnderlineSquiggle } from "@/components/underline-squiggle";
import { Portrait } from "@/components/portrait";
import { Signature } from "@/components/signature";
import { PackageCard, PACKAGES } from "@/components/package-card";
import { getLadderStatus } from "@/lib/ladder.functions";

export const Route = createFileRoute("/")({
  loader: () => getLadderStatus(),
  head: () => ({
    meta: [
      { title: "Kolysa – AI-driven webb-revision, granskad av mig på 24 timmar" },
      {
        name: "description",
        content:
          "AI analyserar din hemsida – jag granskar, prioriterar och står för resultatet. Rapport med betyg och konkreta åtgärder i mejlen inom 24 timmar.",
      },
      { property: "og:title", content: "Kolysa – Webb-revision inom 24 timmar" },
      {
        property: "og:description",
        content:
          "AI-driven analys av din företagshemsida, granskad och prioriterad av Göran Billingskog innan rapporten skickas.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const AREAS = [
  {
    name: "Prestanda",
    body: "Hur snabbt sajten faktiskt laddas på mobil och desktop, och vad som håller nere hastigheten.",
  },
  {
    name: "SEO",
    body: "Om Google förstår vad sidorna handlar om och om rätt saker syns i sökresultaten.",
  },
  {
    name: "Tillgänglighet",
    body: "Att sajten fungerar för besökare med skärmläsare, tangentbord och andra hjälpmedel.",
  },
  {
    name: "Innehåll",
    body: "Om texten säger vad ni gör, till vem, och varför någon ska välja er.",
  },
  {
    name: "Konvertering",
    body: "Hur enkelt det är för en intresserad besökare att faktiskt höra av sig eller köpa.",
  },
  {
    name: "Teknik",
    body: "Underliggande kod, certifikat, domäninställningar och sådant som brukar gå sönder tyst.",
  },
  {
    name: "Säkerhet",
    body: "Uppdateringar, inloggningar och vanliga läckor som utsätter er och era kunder för risk.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Du beställer",
    body: "Fyll i webbadressen och något du vill att jag tittar extra noga på. Betalning sker med kort.",
  },
  {
    n: "02",
    title: "Jag granskar",
    body: "En AI analyserar sajten mot alla sju områden – sedan går jag igenom resultatet, sållar bort bruset och prioriterar det som faktiskt spelar roll för ditt företag. Klart inom 24 timmar (vardagar).",
  },
  {
    n: "03",
    title: "Du får rapporten",
    body: "En PDF landar i din mejl med betyg per område och konkreta åtgärder i prioritetsordning.",
  },
];

function Index() {
  const ladderStatus = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main id="main">
        {/* HERO */}
        <section className="border-b border-rule/70">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 sm:px-8 md:grid-cols-12 md:gap-16 md:pt-24">
            <div className="md:col-span-7">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Webb-revision
              </p>
              <h1 className="mt-5 font-serif text-4xl leading-[1.08] text-ink sm:text-5xl md:text-[3.5rem]">
                Jag granskar din hemsida – och säger vad som{" "}
                <UnderlineSquiggle>faktiskt</UnderlineSquiggle> behöver fixas.
              </h1>
              <p className="prose-measure mt-6 text-lg text-ink/80">
                AI-driven analys, granskad av en riktig människa. Mej. Du får en
                rapport med betyg inom sju områden och konkreta åtgärder i
                prioritetsordning – i mejlen inom 24 timmar.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  to="/bestall"
                  className="inline-flex items-center rounded-[6px] bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Beställ granskning
                </Link>
                <Link
                  to="/exempelrapport"
                  className="text-sm font-medium text-ink underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
                >
                  Se en exempelrapport
                </Link>
              </div>
            </div>

            <aside className="md:col-span-5 md:pt-10">
              <figure className="flex flex-col items-start gap-4 md:items-end md:pl-6">
                <div className="md:mr-6">
                  <Portrait size={220} />
                </div>
                <figcaption className="max-w-[16rem] text-center text-sm text-subtle">
                  Göran Billingskog, grundare. Konsult sedan 1996. Ingen byrå,
                  ingen säljavdelning.
                </figcaption>
              </figure>
            </aside>
          </div>
        </section>

        {/* HUR DET GÅR TILL */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Så går det till
              </p>
              <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
                Tre steg. Inget krångel.
              </h2>
            </div>
            <ol className="md:col-span-8 md:grid md:grid-cols-3 md:gap-8">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="relative border-t border-ink/80 pt-5 [&+li]:mt-10 md:[&+li]:mt-0 after:pointer-events-none after:absolute after:left-1/2 after:top-full after:h-10 after:w-px after:-translate-x-1/2 after:bg-primary/30 after:content-[''] last:after:hidden md:after:left-full md:after:top-[3.5rem] md:after:h-px md:after:w-8 md:after:translate-x-0"
                >
                  <span className="inline-flex items-center justify-center border border-primary/40 px-3 pb-2.5 pt-2">
                    <span className="font-serif text-5xl font-medium leading-none tabular-nums text-primary/90 sm:text-6xl">
                      {s.n}
                    </span>
                  </span>
                  <h3 className="mt-4 font-serif text-xl text-ink">{s.title}</h3>
                  <p className="mt-2 text-[15px] text-subtle">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* VAD DU FÅR */}
        <section className="border-t border-rule/70 bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  Vad du får
                </p>
                <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
                  Sju områden. En rapport. Läsbar på tio minuter.
                </h2>
                <p className="prose-measure mt-5 text-[15px] text-subtle">
                  Jag håller mig till det som spelar roll för ditt företag – inte till en
                  checklista på hundra punkter.
                </p>
              </div>
              <dl className="md:col-span-7 md:pl-6">
                {AREAS.map((a) => (
                  <div
                    key={a.name}
                    className="grid grid-cols-[8rem_minmax(0,1fr)] gap-6 border-t border-rule/70 py-5 first:border-t-0"
                  >
                    <dt className="font-serif text-lg text-ink">{a.name}</dt>
                    <dd className="text-[15px] text-subtle">{a.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* PAKET */}
        <section className="border-t border-rule/70">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Paket
              </p>
              <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
                Välj det som passar dig.
              </h2>
              <p className="mt-4 text-[15px] text-subtle">
                Alla paket börjar med samma granskning: en AI-analys som jag går igenom
                och prioriterar personligen. Skillnaden är hur mycket du vill följa upp
                efteråt.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {PACKAGES.map((p) => (
                <PackageCard key={p.id} pkg={p} ladderStatus={ladderStatus} />
              ))}
            </div>
          </div>
        </section>

        {/* OM GÖRAN */}
        <section className="border-t border-rule/70">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <Portrait size={180} />
            </div>
            <div className="md:col-span-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Om mig
              </p>
              <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
                Jag heter Göran och står bakom varje rapport själv.
              </h2>
              <div className="prose-measure mt-5 space-y-4 text-[15px] text-ink/85">
                <p>
                  Jag har byggt och driftat hemsidor för företag sedan 1996. Då för
                  företag som FedEx och IBM i USA, nu för mindre företag i Sverige.
                </p>
                <p>
                  När din sajt granskas kör jag den genom en AI som synar det tekniska
                  mot dussintals kriterier – snabbare och mer konsekvent än vad någon
                  hinner för hand. Sedan tar jag vid: jag läser sidan som en riktig
                  besökare gör, öppnar den i mobilen och bedömer det en maskin inte
                  fångar – om budskapet landar och om någon faktiskt vill höra av sig.
                </p>
                <p>
                  Du får en rapport som jag har gått igenom och står för – inte en
                  maskinutskrift som skickas oläst. AI:n hittar och mäter; jag avgör
                  vad som är viktigast för just ditt företag och skriver åtgärderna i
                  klartext. Hittar jag något jag är osäker på säger jag det också – och
                  vad jag skulle fråga en utvecklare om.
                </p>
              </div>
              <Signature className="mt-6 text-xl" />
            </div>
          </div>
        </section>

        {/* CTA-band */}
        <section className="bg-primary">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <h2 className="font-serif text-3xl text-primary-foreground sm:text-4xl">
              Vill du ha en ärlig genomgång av din sajt?
            </h2>
            <Link
              to="/bestall"
              className="inline-flex items-center justify-center rounded-[6px] bg-paper px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-paper/90"
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
