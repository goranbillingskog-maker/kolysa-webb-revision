export function Signature({ className = "" }: { className?: string }) {
  return (
    <p className={`font-serif italic text-ink/90 ${className}`} aria-label="Signatur">
      – Göran
    </p>
  );
}
