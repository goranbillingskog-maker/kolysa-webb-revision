import goranAsset from "@/assets/goran.webp.asset.json";

/**
 * Circular portrait of Göran Billingskog.
 */
export function Portrait({ size = 220 }: { size?: number }) {
  return (
    <img
      src={goranAsset.url}
      alt="Porträtt av Göran Billingskog, grundare av Kolysa"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      style={{ width: size, height: size }}
      className="block rounded-full object-cover ring-1 ring-[oklch(0.42_0.09_155)]"
    />
  );
}
