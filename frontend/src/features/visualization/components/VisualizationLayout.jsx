import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { cn } from '@/utils/cn'

export default function VisualizationLayout({
  breadcrumbs = [],
  title,
  subtitle,
  sidebar,
  children,
  className,
}) {
  return (
    <div className={cn('space-y-6 pb-8', className)}>
      {breadcrumbs.length ? <Breadcrumbs items={breadcrumbs} /> : null}

      <header className="space-y-3">
        <div className="space-y-2">
          <h1 className="text-[clamp(2.6rem,4.5vw,4.7rem)] leading-none tracking-tight text-black">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-4xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-28">{sidebar}</aside>
        <main className="min-w-0 space-y-6">{children}</main>
      </div>
    </div>
  )
}
