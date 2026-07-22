// Klientsäker konfiguration för lanseringskampanjen (Rapport-paketet).
// Prislistan för steg 1–10 samt betalningslänkar.
//
// Klistra in de skarpa Lemon Squeezy-länkarna nedan när de finns.
// Ingen annan kod behöver ändras.

export const LADDER_PRICES_SEK: readonly number[] = [
  1, 2, 4, 8, 16, 32, 64, 128, 256, 512,
] as const;

export const STANDARD_REPORT_PRICE_SEK = 795;
export const LADDER_TOTAL_STEPS = LADDER_PRICES_SEK.length; // 10

// Betalningslänkar per kampanjsteg. Index 0 = steg 1.
export const LADDER_PAYMENT_LINKS: readonly string[] = [
  "https://example.lemonsqueezy.com/checkout/rapport-steg-1",
  "https://example.lemonsqueezy.com/checkout/rapport-steg-2",
  "https://example.lemonsqueezy.com/checkout/rapport-steg-3",
  "https://example.lemonsqueezy.com/checkout/rapport-steg-4",
  "https://example.lemonsqueezy.com/checkout/rapport-steg-5",
  "https://example.lemonsqueezy.com/checkout/rapport-steg-6",
  "https://example.lemonsqueezy.com/checkout/rapport-steg-7",
  "https://example.lemonsqueezy.com/checkout/rapport-steg-8",
  "https://example.lemonsqueezy.com/checkout/rapport-steg-9",
  "https://example.lemonsqueezy.com/checkout/rapport-steg-10",
] as const;

export const STANDARD_REPORT_PAYMENT_LINK =
  "https://example.lemonsqueezy.com/checkout/rapport";

// Länkar för de fasta paketen (oförändrade).
export const PLUS_PAYMENT_LINK =
  "https://example.lemonsqueezy.com/checkout/rapport-plus-genomgang";
export const MONITOR_PAYMENT_LINK =
  "https://example.lemonsqueezy.com/checkout/bevakning";

// Stripe Price IDs för kampanjstegen (steg 1..10). Klistra in de skarpa
// price_...-id:na när de finns. Webhooken räknar endast upp ladder_state
// när ett köp matchar ett av dessa Price IDs.
export const LADDER_PRICE_IDS: readonly string[] = [
  "price_ladder_step_1_placeholder",
  "price_ladder_step_2_placeholder",
  "price_ladder_step_3_placeholder",
  "price_ladder_step_4_placeholder",
  "price_ladder_step_5_placeholder",
  "price_ladder_step_6_placeholder",
  "price_ladder_step_7_placeholder",
  "price_ladder_step_8_placeholder",
  "price_ladder_step_9_placeholder",
  "price_ladder_step_10_placeholder",
] as const;

export type LadderStatus = {
  campaign_active: boolean;
  orders_count: number;
  current_step: number; // 1..10 när kampanjen är aktiv; annars 11
  current_price: number;
  next_price: number | null;
  total_steps: number;
  payment_link: string;
};

export function computeLadderStatus(ordersCount: number): LadderStatus {
  const safeCount = Math.max(0, Math.floor(ordersCount));
  const campaign_active = safeCount < LADDER_TOTAL_STEPS;

  if (!campaign_active) {
    return {
      campaign_active: false,
      orders_count: safeCount,
      current_step: LADDER_TOTAL_STEPS + 1,
      current_price: STANDARD_REPORT_PRICE_SEK,
      next_price: null,
      total_steps: LADDER_TOTAL_STEPS,
      payment_link: STANDARD_REPORT_PAYMENT_LINK,
    };
  }

  const current_step = safeCount + 1; // 1..10
  const current_price = LADDER_PRICES_SEK[safeCount];
  const next_price =
    current_step + 1 > LADDER_TOTAL_STEPS
      ? STANDARD_REPORT_PRICE_SEK
      : LADDER_PRICES_SEK[safeCount + 1];

  return {
    campaign_active: true,
    orders_count: safeCount,
    current_step,
    current_price,
    next_price,
    total_steps: LADDER_TOTAL_STEPS,
    payment_link: LADDER_PAYMENT_LINKS[safeCount],
  };
}
