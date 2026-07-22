# Kolysa.com – 4-sidig marknadssajt

En personlig, editorial webbplats för Göran Billingskogs webb-revisionstjänst. All copy på svenska, skriven i första person singular.

## Designsystem

**Färger** (i `src/styles.css` som oklch-tokens):
- Bakgrund: `#FAF7F2` (warm off-white)
- Text: `#1A1A1A` (near-black)
- Accent: `#1F5F3F` (deep warm green) – enda accentfärgen
- Muted/subtle border: mild varm grå härledd från bakgrunden

**Typografi** (laddas via `<link>` i `__root.tsx`):
- Rubriker: Fraunces (serif)
- Brödtext: Inter (sans)
- Generös line-height (1.7 body), max ~65ch radlängd

**Komponenter/detaljer:**
- Knappar: solid grön, 6px radie, ingen shadow/glow
- Hand-drawn underline på ETT nyckelord i hero (inline SVG squiggle)
- Signatur "– Göran" (Fraunces italic) under intro
- Cirkulär porträttplaceholder med caption
- Asymmetriska grid-layouter, vänsterjusterat, mycket whitespace
- Inga emojier, inga gradients, inga glass-effekter, inga stock-illustrationer
- Diskreta hover-states (färg/underline), inga scroll-animationer

## Sidstruktur (TanStack Router)

```
src/routes/
  __root.tsx          → uppdatera: fonter, sitewide meta, ingen chrome här
  index.tsx           → / (startsida) – ERSÄTTER placeholder
  exempelrapport.tsx  → /exempelrapport
  bestall.tsx         → /bestall
  tack.tsx            → /tack
```

Varje route sätter egen `head()` med unik svensk title + meta description + og:title + og:description.
`/tack` får dessutom `robots: noindex`.

## Delade komponenter

```
src/components/
  site-header.tsx     → sticky nav: "Kolysa" wordmark vänster, länk + grön knapp höger
  site-footer.tsx     → 3 kolumner, kontakt, org.nr placeholder, sidlänkar
  package-card.tsx    → paket-kort med pris, features, "Välj"-knapp
  score-bar.tsx       → horisontell scorebar för rapporten
  finding-item.tsx    → radobjekt med severity-badge
  signature.tsx       → "– Göran" i Fraunces italic
  underline-squiggle.tsx → SVG-underline för hero-nyckelord
```

## Sida 1 – Startsida (`/`)

**Head:** title "Kolysa – Manuell granskning av din hemsida på 24 timmar" · meta description om vad jag levererar.

**Innehåll:**
- Sticky header
- Asymmetrisk hero (vänsterspalt 7/12): H1 "Jag granskar din hemsida – och säger vad som faktiskt behöver fixas." (squiggle under "faktiskt"). Underrubrik i brödtext. Primär CTA "Beställ granskning" → `/bestall`, sekundär text-länk "Se exempelrapport".
- Höger 5/12: cirkulär porträttplaceholder + caption "Göran Billingskog, grundare".
- Sektion "Så går det till" – 3 numrerade steg (01/02/03) i asymmetriskt grid, ingen ikon-cirkelmani.
- Sektion "Vad du får" – 7 granskningsområden som text-lista med korta beskrivningar.
- Prispaket – 3 kort (Rapport / Rapport + Genomgång / Rapport + Månadsövervakning), mittenpaketet markeras som "Vanligast".
- Kort "Om Göran"-block med signatur.
- CTA-band i grönt: "Vill du ha en ärlig genomgång av din sajt?" + knapp.
- Footer.

## Sida 2 – Exempelrapport (`/exempelrapport`)

**Head:** title "Exempelrapport – så ser en granskning från Kolysa ut" · meta description enligt spec.

**Innehåll:**
- H1 "Så här ser rapporten ut"
- Kort intro från Göran + signatur
- "Rapport-preview" renderad som print-liknande block:
  - Metadata: "Granskad sajt: maleriexempel.se · Utförd: 12 mars 2026 · Av: Göran Billingskog"
  - Totalpoäng stort: **61/100**
  - Score-bar per dimension (7 st): Prestanda 54, SEO 68, Tillgänglighet 47, Innehåll 72, Konvertering 58, Teknik 63, Säkerhet 65
  - Två utvalda dimensioner ("Tillgänglighet" + "SEO") med 2–3 findings var, severity-badges: **Kritiskt** (röd-brun), **Bör åtgärdas** (varmt gul-brun), **Bra** (grön). Konkret svensk text för Måleri Exempel AB.
- Avslutande CTA-block: "Vill du se samma sak för din sajt?" + grön knapp → `/bestall`
- Footer

## Sida 3 – Beställ (`/bestall`)

**Head:** enligt spec.

**Innehåll:**
- H1 "Beställ din granskning"
- Paketväljare: 3 radio-cards, "Rapport + Genomgång" förvald
- Formulär:
  - Webbadress *
  - Företagsnamn
  - E-post *
  - "Något du särskilt vill att jag tittar på?" (textarea, optional)
- Submit "Till betalning" → på klient: `window.location.href = PAYMENT_URL_[valt paket]`
- Konstanter i toppen av filen med tydlig kommentar för att klistra in Lemon Squeezy-länkar
- Under formulär: liten grå trygghetstext enligt spec
- Footer

Ingen backend – ren client-side redirect. Enkel validering av URL + email.

## Sida 4 – Tack (`/tack`)

**Head:** enligt spec + `{ name: "robots", content: "noindex" }`.

**Innehåll:** H1 + brödtext + signatur + kontaktrad. Länk tillbaka till `/`. Footer.

## SEO / semantik

- Exakt en `<h1>` per sida, logisk h2/h3
- `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>` för rapportblocket
- Descriptive alt-text på alla bilder (även portrait-placeholder)
- Relativa `canonical` + `og:url` per leaf route
- JSON-LD `Organization` i `__root.tsx` (namn Kolysa, e-post info@gorito.com)
- Ingen sitemap/robots skapas om inte användaren ber om det

## Tekniska anteckningar

- Fraunces + Inter via Google Fonts `<link>` i `__root.tsx` head, familjer registreras som `--font-serif` / `--font-sans` i `@theme`
- Squiggle-underline som inline SVG-komponent (ren HTML/CSS, ingen animation)
- Ingen ny dependency behövs; shadcn button/input/textarea/radio-group finns redan i templaten och styleas via tokens
- Placeholder-porträtt: enkel neutral SVG-cirkel med initialer "GB" i serif – ingen AI-genererad bild
- Ingen cookie-banner, chat, popup

## Vad som INTE ingår

- Ingen backend, ingen Cloudflare, ingen Lovable Cloud
- Ingen faktisk betalningsintegration (bara redirect till konstanta URL:er)
- Ingen sitemap.xml / robots.txt (kan läggas till senare på begäran)
