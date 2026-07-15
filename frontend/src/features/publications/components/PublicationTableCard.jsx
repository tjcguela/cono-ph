import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'

export default function PublicationTableCard({
  title,
  action,
  children,
  className,
}) {
  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <div className="flex flex-col gap-3 border-b border-[var(--app-border)] px-5 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-[1.55rem] leading-none text-[var(--app-text)]">{title}</h2>
        </div>
        {action}
      </div>

      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </Card>
  )
}
