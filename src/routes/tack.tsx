import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Signature } from "@/components/signature";

export const Route = createFileRoute("/tack")({
  head: () => ({
    meta: [
      { title: "Tack för din beställning – Kolysa" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Tack för din beställning. AI:n startar analysen – jag granskar och skickar rapporten inom 24 timmar.",
      },
      { property: "og:title", content: "Tack för din beställning – Kolysa" },
      {
        property: "og:description",
        content: "AI:n har startat analysen. Jag granskar, prioriterar och skickar rapporten till din mejl inom 24 timmar (vardagar).",
      },
      { property: "og:url", content: "/tack" },
    ],
    links: [{ rel: "canonical", href: "/tack" }],
  }),
  component: TackPage,
});

function TackPage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-2xl px-5 pb-24 pt-20 sm:px-8 md:pt-28">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Bekräftelse
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
          Tack! Nu sätter jag igång.
        </h1>
        <div className="prose-measure mt-6 space-y-4 text-[17px] text-ink/85">
          <p>
            Din rapport levereras till din mejl inom 24 timmar (vardagar). Om jag hittar
            något akut hör jag av mig direkt.
          </p>
        </div>
        <Signature className="mt-6 text-xl" />

        <p className="mt-10 text-[15px] text-subtle">
          Har du frågor under tiden? Mejla mig på{" "}
          <a href="mailto:info@gorito.com" className="text-ink underline decoration-primary decoration-2 underline-offset-4 hover:text-primary">
            info@gorito.com
          </a>
          .
        </p>

        <div className="mt-12 border-t border-rule pt-6">
          <Link
            to="/"
            className="text-sm font-medium text-ink underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
          >
            ← Till startsidan
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
