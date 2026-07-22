type Severity = "Kritiskt" | "Bör åtgärdas" | "Bra";

const styles: Record<Severity, string> = {
  Kritiskt: "border-critical/40 bg-critical/10 text-critical",
  "Bör åtgärdas": "border-warn/40 bg-warn/10 text-warn",
  Bra: "border-primary/40 bg-primary/10 text-primary",
};

export function FindingItem({
  severity,
  title,
  body,
}: {
  severity: Severity;
  title: string;
  body: string;
}) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-t border-rule/70 py-5 first:border-t-0">
      <span
        className={`shrink-0 rounded-[4px] border px-2 py-1 text-[11px] font-medium uppercase tracking-wide ${styles[severity]}`}
      >
        {severity}
      </span>
      <div className="min-w-0">
        <p className="font-serif text-lg text-ink">{title}</p>
        <p className="mt-1 text-[15px] text-subtle">{body}</p>
      </div>
    </li>
  );
}
