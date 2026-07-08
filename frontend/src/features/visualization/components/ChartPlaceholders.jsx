import { cn } from '@/utils/cn'

function PlaceholderFrame({ title, className, children }) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-4 sm:p-5',
        className,
      )}
    >
      <p className="text-sm font-semibold text-brand-800">{title}</p>
      <div className="mt-4 flex min-h-0 flex-1 items-center justify-center">{children}</div>
    </div>
  )
}

export function DonutChartPlaceholder({ className }) {
  return (
    <PlaceholderFrame title="Donut chart placeholder" className={className}>
      <div className="flex h-48 w-48 items-center justify-center rounded-full border-[18px] border-brand-300 border-r-brand-700 border-b-brand-700 bg-white shadow-sm" />
    </PlaceholderFrame>
  )
}

export function BarChartPlaceholder({ className }) {
  const bars = [40, 68, 50, 82, 60, 72]

  return (
    <PlaceholderFrame title="Bar chart placeholder" className={className}>
      <div className="flex h-48 w-full items-end gap-3 px-4">
        {bars.map((height, index) => (
          <div key={`${height}-${index}`} className="flex h-full flex-1 items-end">
            <div className="mx-auto w-full max-w-12 rounded-t-2xl bg-brand-700/90" style={{ height: `${height}%` }} />
          </div>
        ))}
      </div>
    </PlaceholderFrame>
  )
}

export function MapPlaceholder({ className }) {
  return (
    <PlaceholderFrame title="Map placeholder" className={className}>
      <div className="relative h-56 w-full rounded-3xl border border-[var(--app-border)] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(108,127,34,0.18),transparent_30%),radial-gradient(circle_at_75%_55%,rgba(160,180,74,0.18),transparent_28%),linear-gradient(135deg,rgba(243,246,232,0.9),rgba(255,255,255,0.98))]" />
        <div className="absolute inset-6 rounded-2xl border border-dashed border-brand-200" />
        <div className="absolute left-8 top-8 h-20 w-24 rounded-[32%_68%_58%_42%/49%_48%_52%_51%] bg-brand-200/80" />
        <div className="absolute right-14 top-16 h-24 w-18 rounded-[55%_45%_44%_56%/45%_42%_58%_55%] bg-brand-300/80" />
        <div className="absolute bottom-10 left-16 h-16 w-16 rounded-[41%_59%_63%_37%/48%_42%_58%_52%] bg-brand-700/20" />
      </div>
    </PlaceholderFrame>
  )
}

export function TablePlaceholder({ className }) {
  const rows = Array.from({ length: 5 })

  return (
    <PlaceholderFrame title="Table placeholder" className={className}>
      <div className="w-full overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white">
        <div className="grid grid-cols-4 gap-3 border-b border-[var(--app-border)] bg-brand-50/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
          <span>Label</span>
          <span>Count</span>
          <span>Coverage</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-[var(--app-border)]">
          {rows.map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 px-4 py-3">
              <span className="h-3.5 rounded-full bg-brand-100" />
              <span className="h-3.5 rounded-full bg-brand-200" />
              <span className="h-3.5 rounded-full bg-brand-100" />
              <span className="h-3.5 rounded-full bg-brand-200" />
            </div>
          ))}
        </div>
      </div>
    </PlaceholderFrame>
  )
}
