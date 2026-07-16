import { Card as TremorCard, DonutChart, Metric, Text, Title } from '@tremor/react'
import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import ChartCard from '@/features/visualization/components/ChartCard'

function PreviewList({ title, items }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[0.95rem] font-semibold text-[var(--app-muted)]">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate italic text-[var(--app-muted)]">{item.name}</span>
            <span className="shrink-0 text-[var(--app-muted)]">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function OverviewPreviewCard({ card }) {
  const showStaticMap = Boolean(card.previewImage)
  const Icon = card.icon

  return (
    <ChartCard
      title={card.title}
      viewAllLabel={card.viewAllLabel}
      viewAllTo={card.viewAllTo}
      className="h-full"
    >
      <div className="flex h-full flex-col gap-5">
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            {Icon ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
            ) : null}
            <p className="text-[1rem] font-medium text-[var(--app-muted)]">{card.previewTitle}</p>
          </div>

          {showStaticMap ? (
            <div className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-white">
              <img
                src={card.previewImage}
                alt={card.previewAlt}
                className="h-[220px] w-full object-cover object-center sm:h-[280px] lg:h-[330px]"
              />
            </div>
          ) : (
            <TremorCard className="border border-[var(--app-border)] bg-white p-4 shadow-none">
              <Title className="text-[1rem] font-medium text-[var(--app-muted)]">{card.previewTitle}</Title>
              <Metric className="mt-2 text-[2rem] leading-none text-[var(--app-text)]">
                {card.id === 'conopeptides' ? '3,671' : '312'}
              </Metric>
              <Text className="mt-1 text-sm text-[var(--app-muted)]">
                {card.id === 'conopeptides'
                  ? 'Conopeptide superfamily distribution'
                  : 'Marker coverage across species'}
              </Text>

              <div className="mt-5">
                <DonutChart data={card.chartData} category="name" value="value" variant="donut" className="h-72" />
              </div>
            </TremorCard>
          )}
        </section>

        <div className="flex-1">
          <PreviewList title={card.listTitle} items={card.listItems} />
        </div>

        <div className="pt-1">
          <Button as={Link} to={card.ctaTo} variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-56">
            {card.ctaLabel}
          </Button>
        </div>
      </div>
    </ChartCard>
  )
}

export default function OverviewCardsSection({ cards }) {
  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {cards.map((card) => (
        <OverviewPreviewCard key={card.id} card={card} />
      ))}
    </section>
  )
}
