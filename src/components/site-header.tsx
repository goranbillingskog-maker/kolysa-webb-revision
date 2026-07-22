import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          className="font-serif text-2xl tracking-tight text-ink"
          aria-label="Kolysa – startsida"
        >
          Kolysa
        </Link>
        <nav aria-label="Huvudmeny" className="flex items-center gap-3 sm:gap-6">
          <Link
            to="/exempelrapport"
            className="hidden text-sm text-ink/80 transition-colors hover:text-primary sm:inline"
            activeProps={{ className: "text-primary" }}
          >
            Exempelrapport
          </Link>
          <Link
            to="/bestall"
            className="inline-flex items-center rounded-[6px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Beställ granskning
          </Link>
        </nav>
      </div>
    </header>
  );
}
