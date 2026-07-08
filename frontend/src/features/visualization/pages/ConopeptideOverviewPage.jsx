import ChartCard from '@/features/visualization/components/ChartCard'
import {
  BarChartPlaceholder,
  DonutChartPlaceholder,
} from '@/features/visualization/components/ChartPlaceholders'
import MetricCard from '@/features/visualization/components/MetricCard'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import Table from '@/components/ui/Table'
import {
  conopeptideLengthBins,
  conopeptideOverviewBreadcrumbs,
  conopeptideOverviewMeta,
  conopeptideOverviewMetrics,
  conopeptideSuperfamilyLegend,
  conopeptideTopAbundantRows,
} from '@/features/visualization/data/visualizationMockData'

function LegendItem({ label, count, percent, color }) {
  return (
    <li className="flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-3">
        <span className={`h-5 w-5 rounded-sm border border-[var(--app-border)] ${color}`} />
        <span className="uppercase tracking-wide text-[var(--app-muted)]">{label}</span>
      </div>
      <span className="text-[var(--app-muted)]">
        {count} ({percent})
      </span>
    </li>
  )
}

export default function ConopeptideOverviewPage() {
  return (
    <VisualizationLayout
      breadcrumbs={conopeptideOverviewBreadcrumbs}
      title={conopeptideOverviewMeta.title}
      subtitle={conopeptideOverviewMeta.subtitle}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {conopeptideOverviewMetrics.map((metric) => (
          <MetricCard key={metric.label} icon={metric.icon} value={metric.value} label={metric.label} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Conopeptide Superfamily Distribution" viewAllLabel="View full list" viewAllTo="/visualization/conopeptides">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
            <div className="grid place-items-center">
              <DonutChartPlaceholder className="min-h-[320px] w-full max-w-[420px]" />
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium text-[var(--app-muted)]">Legend</h3>
              <ul className="space-y-4">
                {conopeptideSuperfamilyLegend.map((item) => (
                  <LegendItem key={item.label} {...item} />
                ))}
              </ul>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Precursor Length Distribution" viewAllLabel="View full list" viewAllTo="/visualization/conopeptides">
          <BarChartPlaceholder
            items={conopeptideLengthBins}
            yAxisLabel="Number of Precursors"
            xAxisLabel="Length (Amino Acids)"
          />
        </ChartCard>
      </section>

      <ChartCard title="Top 10 Most Abundant Conopeptides" viewAllLabel="View full list" viewAllTo="/visualization/conopeptides">
        <Table
          columns={['Conopeptide / Toxin Name', 'Superfamily', 'Framework', 'Count', 'Linked Species']}
        >
          {conopeptideTopAbundantRows.map((row) => (
            <tr key={`${row.name}-${row.count}`} className="border-b border-[var(--app-border)] last:border-b-0">
              <td className="px-4 py-3 font-medium text-[var(--app-text)]">{row.name}</td>
              <td className="px-4 py-3 text-[var(--app-muted)]">{row.superfamily}</td>
              <td className="px-4 py-3 text-[var(--app-muted)]">{row.framework}</td>
              <td className="px-4 py-3 text-[var(--app-muted)]">{row.count}</td>
              <td className="px-4 py-3 text-[var(--app-muted)]">{row.species}</td>
            </tr>
          ))}
        </Table>
      </ChartCard>
    </VisualizationLayout>
  )
}
