import ChartCard from '@/features/visualization/components/ChartCard'
import {
  BarChartPlaceholder,
  DonutChartPlaceholder,
  RankedListPlaceholder,
} from '@/features/visualization/components/ChartPlaceholders'
import MetricCard from '@/features/visualization/components/MetricCard'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import VisualizationSidebar from '@/features/visualization/components/VisualizationSidebar'
import {
  speciesOverviewBreadcrumbs,
  speciesOverviewMeta,
  speciesOverviewMetrics,
  speciesProvinceCoverage,
  speciesProvinceLegend,
  speciesSubgenusLegend,
  speciesTopSequencedSpecies,
  visualizationMapPreview,
} from '@/features/visualization/data/visualizationMockData'

function LegendItem({ label, color }) {
  return (
    <li className="flex items-center gap-3 text-sm text-[var(--app-muted)]">
      <span className={`h-6 w-6 rounded-sm border border-[var(--app-border)] ${color}`} />
      <span>{label}</span>
    </li>
  )
}

function ZoomControl() {
  return (
    <div className="absolute right-4 top-4 overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm">
      <button
        type="button"
        aria-label="Zoom in"
        className="flex h-10 w-10 items-center justify-center border-b border-[var(--app-border)] text-xl text-[var(--app-text)]"
      >
        +
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        className="flex h-10 w-10 items-center justify-center text-xl text-[var(--app-text)]"
      >
        -
      </button>
    </div>
  )
}

export default function SpeciesOverviewPage() {
  return (
    <VisualizationLayout
      breadcrumbs={speciesOverviewBreadcrumbs}
      title={speciesOverviewMeta.title}
      subtitle={speciesOverviewMeta.subtitle}
      sidebar={<VisualizationSidebar />}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {speciesOverviewMetrics.map((metric) => (
          <MetricCard key={metric.label} icon={metric.icon} value={metric.value} label={metric.label} />
        ))}
      </section>

      <ChartCard title="Species Distribution by Province">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--app-border)] bg-white">
              <img
                src={visualizationMapPreview}
                alt="Species distribution by province preview map"
                className="h-[650px] w-full object-cover object-center"
              />
              <ZoomControl />
            </div>

            <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
              <div className="space-y-3">
                <h3 className="text-base font-medium text-[var(--app-muted)]">Legend</h3>
                <ul className="space-y-3">
                  {speciesProvinceLegend.map((item) => (
                    <LegendItem key={item.label} label={item.label} color={item.color} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Top 10 Most Sequenced Species" viewAllLabel="View full list" viewAllTo="/visualization/species">
          <RankedListPlaceholder
            items={speciesTopSequencedSpecies.map((item) => ({ label: item.name, value: item.value }))}
            leftHeader="Species"
            rightHeader="Number of Sequences"
          />
        </ChartCard>

        <ChartCard title="Species by Subgenus" viewAllLabel="View full list" viewAllTo="/visualization/species">
          <div className="space-y-6">
            <div className="grid place-items-center">
              <DonutChartPlaceholder className="min-h-[260px] w-full" />
            </div>

            <div className="space-y-4">
              <ul className="grid gap-3 sm:grid-cols-2">
                {speciesSubgenusLegend.map((item) => (
                  <LegendItem key={item.label} label={item.label} color={item.color} />
                ))}
              </ul>
            </div>
          </div>
        </ChartCard>
      </section>

      <ChartCard title="Sequencing Coverage Across Provinces">
        <BarChartPlaceholder
          items={speciesProvinceCoverage}
          yAxisLabel="Number of Species"
          xAxisLabel="Province"
        />
      </ChartCard>
    </VisualizationLayout>
  )
}
