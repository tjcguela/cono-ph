import { Link } from 'react-router-dom'
import { AreaChart, BarList, Card as TremorCard, DonutChart, Metric, Text, Title } from '@tremor/react'

import Button from '@/components/ui/Button'
import ChartCard from '@/features/visualization/components/ChartCard'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import {
  visualizationBreadcrumbs,
  visualizationInsights,
  visualizationMeta,
  visualizationMetrics,
  visualizationOverviewCards,
  biomarkerCoverageData,
  biomarkerDensityByProvince,
  conopeptideLengthBins,
  conopeptideSuperfamilyLegend,
  speciesProvinceCoverage,
  speciesProvinceLegend,
  speciesTopSequencedSpecies,
  biomarkerTypeLegend,
} from '@/features/visualization/data/visualizationMockData'

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

function InsightCard({ children }) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--app-border)] bg-white p-4 shadow-[0_10px_24px_rgba(16,16,16,0.03)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-brand-50" />
        <p className="text-sm leading-6 text-[var(--app-muted)]">{children}</p>
      </div>
    </div>
  )
}

function OverviewPreviewCard({ card }) {
  const showStaticMap = Boolean(card.previewImage)
  const Icon = card.icon

  const speciesChartData = speciesTopSequencedSpecies.map((item) => ({
    name: item.name,
    value: item.value,
  }))

  const biomarkerChartData = biomarkerCoverageData.map((item) => ({
    name: item.label,
    value: item.value,
  }))

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
                {card.id === 'conopeptides' ? (
                  <DonutChart
                    data={conopeptideSuperfamilyLegend.map((item) => ({
                      name: item.label,
                      value: item.count,
                    }))}
                    category="name"
                    value="value"
                    variant="donut"
                    className="h-72"
                  />
                ) : (
                  <DonutChart
                    data={biomarkerChartData}
                    category="name"
                    value="value"
                    variant="donut"
                    className="h-72"
                  />
                )}
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

function MetricJoinCard({ metric }) {
  const Icon = metric.icon

  return (
    <div className="join-item flex min-w-0 flex-1 gap-4 border border-[var(--app-border)] bg-white p-4 sm:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        {Icon ? <Icon className="h-6 w-6" strokeWidth={1.8} /> : null}
      </div>

      <div className="min-w-0">
        <p className="text-[1.65rem] font-semibold tracking-tight text-[var(--app-text)] sm:text-[1.8rem]">
          {metric.value}
        </p>
        <p className="mt-1 text-[0.92rem] font-semibold text-brand-700">{metric.label}</p>
        {metric.description ? (
          <p className="mt-1 text-[0.92rem] leading-6 text-[var(--app-muted)]">{metric.description}</p>
        ) : null}
      </div>
    </div>
  )
}

export default function VisualizationPage() {
  const speciesAreaData = speciesProvinceCoverage.map((value, index) => ({
    province: `Province ${index + 1}`,
    Species: value.value,
  }))

  const biomarkerBarData = biomarkerDensityByProvince.map((item) => ({
    name: item.label,
    biomarker: item.value,
  }))

  const conopeptideLineData = conopeptideLengthBins.map((item) => ({
    range: item.label,
    count: item.value,
  }))

  return (
    <VisualizationLayout
      breadcrumbs={visualizationBreadcrumbs}
      title={visualizationMeta.title}
      subtitle={visualizationMeta.subtitle}
    >
      <section className="join w-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--app-border)] bg-white shadow-[0_10px_26px_rgba(16,16,16,0.04)] xl:flex-row">
        {visualizationMetrics.map((metric) => (
          <MetricJoinCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {visualizationOverviewCards.map((card) => (
          <OverviewPreviewCard key={card.id} card={card} />
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        <TremorCard className="xl:col-span-2 border border-[var(--app-border)] bg-white p-4 shadow-sm sm:p-5">
          <Title className="text-[1.2rem] text-[var(--app-text)]">Species coverage</Title>
          <Text className="mt-1 text-sm text-[var(--app-muted)]">
            Species distribution by province and sequencing coverage.
          </Text>
          <AreaChart
            className="mt-6 h-80"
            data={speciesAreaData}
            index="province"
            categories={['Species']}
            colors={['indigo']}
            yAxisWidth={40}
            showLegend={false}
          />
        </TremorCard>

        <TremorCard className="border border-[var(--app-border)] bg-white p-4 shadow-sm sm:p-5">
          <Title className="text-[1.2rem] text-[var(--app-text)]">Biomarker density</Title>
          <Text className="mt-1 text-sm text-[var(--app-muted)]">Top provinces by biomarker records.</Text>
          <div className="mt-6">
            <BarList
              data={biomarkerBarData}
              valueFormatter={(value) => `${value}`}
            />
          </div>
        </TremorCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <TremorCard className="border border-[var(--app-border)] bg-white p-4 shadow-sm sm:p-5">
          <Title className="text-[1.2rem] text-[var(--app-text)]">Conopeptide length bins</Title>
          <Text className="mt-1 text-sm text-[var(--app-muted)]">Sequence length distribution across precursors.</Text>
          <AreaChart
            className="mt-6 h-72"
            data={conopeptideLineData}
            index="range"
            categories={['count']}
            colors={['amber']}
            yAxisWidth={40}
            showLegend={false}
          />
        </TremorCard>

        <TremorCard className="border border-[var(--app-border)] bg-white p-4 shadow-sm sm:p-5">
          <Title className="text-[1.2rem] text-[var(--app-text)]">Coverage snapshot</Title>
          <Text className="mt-1 text-sm text-[var(--app-muted)]">Species with biomarker data vs. without data.</Text>
          <div className="mt-6">
            <DonutChart
              data={biomarkerCoverageData.map((item) => ({
                name: item.label,
                value: item.value,
              }))}
              category="name"
              value="value"
              variant="donut"
              className="h-72"
            />
          </div>
        </TremorCard>
      </div>

      <div className="space-y-5 bg-brand-50/20 p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
          <div className="space-y-2">
            <h2 className="text-[1.8rem] leading-none text-black">Cross-Data Insights</h2>
            <p className="text-sm leading-6 text-[var(--app-muted)] sm:text-base">
              Integrated insights across species, conopeptides, and biomarkers.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {visualizationInsights.map((insight) => (
              <InsightCard key={insight}>{insight}</InsightCard>
            ))}
          </div>
        </div>
      </div>
    </VisualizationLayout>
  )
}
