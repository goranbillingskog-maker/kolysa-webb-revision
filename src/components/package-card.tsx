import { Link } from "@tanstack/react-router";

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
      "Manuell granskning av sju områden",
      "Betyg och totalpoäng",
      "Konkreta åtgärder i prioritetsordning",
      "PDF till din mejl",
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
      "Svar på uppföljande frågor via mejl i två veckor",
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

export function PackageCard({ pkg }: { pkg: PackageInfo }) {
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
      <p className="mt-3 font-serif text-3xl text-ink">{pkg.price}</p>
      <p className="mt-2 text-sm text-subtle">{pkg.tagline}</p>
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
