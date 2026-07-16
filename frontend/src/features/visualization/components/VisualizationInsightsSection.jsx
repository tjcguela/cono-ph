export default function InsightsSection({ insights }) {
  return (
    <div className="space-y-5 bg-brand-50/20 p-5 sm:p-6">
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
        <div className="space-y-2">
          <h2 className="text-[1.8rem] leading-none text-black">Cross-Data Insights</h2>
          <p className="text-sm leading-6 text-[var(--app-muted)] sm:text-base">
            Integrated insights across species, conopeptides, and biomarkers.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {insights.map((insight) => (
            <div key={insight} className="rounded-[1.25rem] border border-[var(--app-border)] bg-white p-4 shadow-[0_10px_24px_rgba(16,16,16,0.03)]">
              <p className="text-sm leading-6 text-[var(--app-muted)]">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
