# Kolysa: Webbgranskning Med Omtanke

Build a 4-page marketing website for Kolysa.com — a Swedish one-man service where business owners order a professional website audit ("webb-revision") and receive a scored PDF report within 24 hours. All visible copy must be in Swedish. The site is personal: it comes from Göran Billingskog, an independent web consultant — NOT a big agency. First person singular ("jag granskar", "jag skickar") throughout.

Design direction — this must NOT look AI-generated


No purple/blue gradients, no glassmorphism, no floating 3D blobs, no emoji as icons, no generic stock illustrations. These scream template.
Editorial, almost print-like feel: warm off-white background (#FAF7F2), near-black text (#1A1A1A), ONE accent color — deep warm green (#1F5F3F). Nothing else.
Typography: a serif for headlines (e.g. "Fraunces" or "Source Serif 4"), a clean sans for body (e.g. "Inter"). Generous line-height, max ~65ch line length.
Asymmetric layouts, plenty of whitespace, left-aligned text. Avoid perfectly centered symmetric hero sections.
Small human touches: a subtle hand-drawn underline under one key word in the hero, a personal signature "– Göran" under the intro text, a circular portrait photo placeholder with caption "Göran Billingskog, grundare".
Buttons: solid green, slightly rounded (6px), no shadows or glow effects.
Subtle, fast interactions only. No scroll-triggered animation circus.


SEO — treat as top priority


Semantic HTML: exactly one 

 per page, logical h2/h3 hierarchy, , , 

, descriptive alt text on every image.
Unique Swedish @gorito.com · Organisationsnummer: [FYLL I]". Links to the pages. No fake office address, no social icons that go nowhere.


Page 2 — Exempelrapport (/exempelrapport)

Title tag: "Exempelrapport – så ser en granskning från Kolysa ut"
Meta description: "Se exakt vad du får: en riktig exempelrapport med betyg inom sju områden och konkreta rekommendationer."

H1: "Så här ser rapporten ut". Short intro from Göran, then a long-form report preview rendered on the page: overall score (e.g. 61/100), a score bar per dimension, and for two dimensions show 2–3 example findings with severity labels (Kritiskt / Bör åtgärdas / Bra). Use realistic placeholder content for a fictional company "Måleri Exempel AB". End with CTA: "Vill du se samma sak för din sajt?" + button → /bestall.

Page 3 — Beställ (/bestall)

Title tag: "Beställ granskning av din hemsida – Kolysa"
Meta description: "Beställ en manuell granskning av din hemsida. Rapport med betyg och åtgärder inom 24 timmar."

H1: "Beställ din granskning". Package selector (the three packages, Rapport + Genomgång preselected), then a short form: Webbadress (required), Företagsnamn, E-post (required), "Något du särskilt vill att jag tittar på?" (optional textarea). Submit button "Till betalning". On submit, redirect to a payment link — use placeholder constant PAYMENT_URL_REPORT, PAYMENT_URL_PLUS, PAYMENT_URL_MONITOR per package so I can paste in Lemon Squeezy links later. Below the form, a quiet reassurance line: "Du betalar säkert med kort. Rapporten levereras av mig personligen inom 24 timmar."

Page 4 — Tack (/tack)

Title tag: "Tack för din beställning – Kolysa"
Add noindex meta on this page.

H1: "Tack! Nu sätter jag igång." Body: "Din rapport levereras till din mejl inom 24 timmar (vardagar). Om jag hittar något akut hör jag av mig direkt. / – Göran". Include a line "Har du frågor under tiden? Mejla mig på info@gorito.com."

General


Sticky top nav: Kolysa wordmark (text only, serif) left; "Exempelrapport" and green button "Beställ granskning" right.
Mobile-first; everything must look excellent at 375px width.
No cookie banner, no chat widget, no newsletter popup.
Write all copy as final, natural Swedish — no lorem ipsum anywhere.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ead81533-3975-4dee-a9da-3e536b915c3c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
