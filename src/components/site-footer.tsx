import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl text-ink">Kolysa.com</p>
          <p className="mt-3 max-w-xs text-sm text-subtle">
            Webb-revision: AI-analys granskad av en riktig människa. En rapport, 24 timmar.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">Sidor</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="text-ink hover:text-primary">Start</Link></li>
            <li><Link to="/exempelrapport" className="text-ink hover:text-primary">Exempelrapport</Link></li>
            <li><Link to="/bestall" className="text-ink hover:text-primary">Beställ granskning</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">Kontakt</p>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            <li>
              <a href="mailto:info@gorito.com" className="hover:text-primary">
                info@gorito.com
              </a>
            </li>
            <li className="text-subtle">Organisationsnummer: 559333-0227</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule/70">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-subtle sm:px-8">
          © {new Date().getFullYear()} Kolysa. Varje rapport granskas och godkänns personligen av Göran Billingskog.
        </div>
      </div>
    </footer>
  );
}
