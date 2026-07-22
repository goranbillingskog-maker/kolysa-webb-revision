export function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-sm font-medium text-ink">{label}</span>
          <span className="shrink-0 font-serif text-sm tabular-nums text-ink/80">
            {value}<span className="text-subtle">/100</span>
          </span>
        </div>
        <div className="mt-2 h-[3px] w-full bg-rule/80" role="presentation">
          <div
            className="h-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
