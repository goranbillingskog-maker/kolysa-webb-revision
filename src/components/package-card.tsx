import { Link } from "@tanstack/react-router";
import type { LadderStatus } from "@/lib/ladder-config";

export type PackageId = "report" | "plus" | "monitor";

export interface PackageInfo {
  id: PackageId;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  featured?: boolean;
}

export const PACKAGES: PackageInfo[] = [
  {
    id: "report",
    name: "Rapport",
    price: "795 kr",
    tagline: "Skriftlig granskning levererad inom 24 timmar.",
    features: [
      "AI-analys av startsidan, granskad av mig",
      "Betyg inom sju områden",
      "PDF-rapport via mejl",
      "Leverans inom 24 timmar (vardagar)",
    ],
  },
  {
    id: "plus",
    name: "Rapport + Genomgång",
    price: "1 995 kr",
    tagline: "Rapporten plus ett videosamtal där vi går igenom allt.",
    features: [
      "Allt i Rapport",
      "30 min videomöte med mig",
      "Prioriterad åtgärdslista",
    ],
    featured: true,
  },
  {
    id: "monitor",
    name: "Bevakning",
    price: "249 kr / mån",
    tagline: "För dig som vill hålla koll över tid.",
    features: [
      "Ny granskning varje kvartal",
      "Larm om betyget sjunker",
      "Kort statusmejl efter varje granskning",
    ],
  },
];

function LadderProgress({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  return (
    <div
      className="mt-4 flex gap-1.5"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={step - 1}
      aria-label={`Rapport ${step} av ${total} i lanseringskampanjen`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const taken = i < step - 1;
        const current = i === step - 1;
        return (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              taken
                ? "bg-primary"
                : current
                  ? "bg-primary/50"
                  : "bg-ink/10"
            }`}
          />
        );
      })}
    </div>
  );
}

function formatKr(n: number): string {
  return `${n.toLocaleString("sv-SE")} kr`;
}

export function PackageCard({
  pkg,
  ladderStatus,
}: {
  pkg: PackageInfo;
  ladderStatus?: LadderStatus | null;
}) {
  const showCampaign =
    pkg.id === "report" && ladderStatus?.campaign_active === true;

  return (
    <article
      className={`flex h-full flex-col rounded-[6px] border p-6 ${
        pkg.featured ? "border-primary bg-primary/[0.04]" : "border-rule bg-paper"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">{pkg.name}</h3>
        {pkg.featured && (
          <span className="rounded-[4px] bg-primary px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary-foreground">
            Vanligast
          </span>
        )}
      </div>

      {showCampaign && ladderStatus ? (
        <div className="mt-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
            Lanseringskampanj
          </p>
          <p className="mt-2 font-serif text-2xl leading-tight text-ink">
            Rapport #{ladderStatus.current_step} av {ladderStatus.total_steps}{" "}
            kostar just nu{" "}
            <span className="tabular-nums">
              {formatKr(ladderStatus.current_price)}
            </span>
          </p>
          <p className="mt-2 text-sm text-subtle">
            Nästa beställning:{" "}
            <span className="tabular-nums">
              {ladderStatus.next_price !== null
                ? formatKr(ladderStatus.next_price)
                : formatKr(795)}
            </span>
            . Därefter ordinarie pris 795 kr.
          </p>
          <LadderProgress
            step={ladderStatus.current_step}
            total={ladderStatus.total_steps}
          />
          <p className="mt-4 text-[13px] italic text-ink/75">
            Varför? De första kunderna hjälper mig visa vad Kolysa går för — i
            utbyte får du rapporten till en bråkdel av priset.
          </p>
          <p className="mt-3 text-[12px] text-subtle">
            Kampanjpriset förutsätter att jag får använda din granskning som
            anonymiserat exempel.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-3 font-serif text-3xl text-ink">{pkg.price}</p>
          <p className="mt-2 text-sm text-subtle">{pkg.tagline}</p>
        </>
      )}

      <ul className="mt-5 space-y-2 text-[15px] text-ink">
        {pkg.features.map((f) => (
          <li key={f} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
            <span aria-hidden="true" className="mt-2 h-px w-3 bg-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex-1" />
      <Link
        to="/bestall"
        search={{ paket: pkg.id }}
        className="mt-2 inline-flex w-full items-center justify-center rounded-[6px] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Välj {pkg.name.toLowerCase()}
      </Link>
    </article>
  );
}
