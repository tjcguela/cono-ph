import ChartCard from '@/features/visualization/components/ChartCard'
import {
  DonutChartPlaceholder,
  GaugePlaceholder,
  BarChartPlaceholder,
} from '@/features/visualization/components/ChartPlaceholders'
import MetricCard from '@/features/visualization/components/MetricCard'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import Table from '@/components/ui/Table'
import {
  biomarkerCoverageData,
  biomarkerDensityByProvince,
  biomarkerOverviewBreadcrumbs,
  biomarkerOverviewMeta,
  biomarkerOverviewMetrics,
  biomarkerSummaryRows,
  biomarkerTypeLegend,
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

export default function BiomarkerOverviewPage() {
  return (
    <VisualizationLayout
      breadcrumbs={biomarkerOverviewBreadcrumbs}
      title={biomarkerOverviewMeta.title}
      subtitle={biomarkerOverviewMeta.subtitle}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {biomarkerOverviewMetrics.map((metric) => (
          <MetricCard key={metric.label} icon={metric.icon} value={metric.value} label={metric.label} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Biomarker Type Distribution" viewAllLabel="View full list" viewAllTo="/visualization/biomarkers">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
            <div className="grid place-items-center">
              <DonutChartPlaceholder className="min-h-[320px] w-full max-w-[420px]" />
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium text-[var(--app-muted)]">Legend</h3>
              <ul className="space-y-4">
                {biomarkerTypeLegend.map((item) => (
                  <LegendItem key={item.label} {...item} />
                ))}
              </ul>
            </div>
          </div>
        </ChartCard>

      <ChartCard title="Biomarker Coverage Across Species" viewAllLabel="View full list" viewAllTo="/visualization/biomarkers">
          <div className="space-y-6">
            <GaugePlaceholder
              value={biomarkerCoverageData[0].value}
              label={biomarkerCoverageData[0].label}
              details={`${biomarkerCoverageData[1].label}: ${biomarkerCoverageData[1].value}%`}
            />
            <div className="rounded-2xl border border-[var(--app-border)] bg-brand-50/40 px-4 py-3 text-sm text-[var(--app-muted)]">
              Mock coverage split for biomarker presence across sequenced species.
            </div>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <ChartCard title="Biomarker Density by Province" viewAllLabel="View full list" viewAllTo="/visualization/biomarkers">
          <BarChartPlaceholder
            items={biomarkerDensityByProvince}
            yAxisLabel="Number of Biomarker Records"
            xAxisLabel="Province"
          />
        </ChartCard>

        <ChartCard title="Top Biomarker Records" viewAllLabel="View full list" viewAllTo="/visualization/biomarkers" className="xl:col-span-1">
          <Table columns={['Biomarker ID', 'Marker Type', 'Species', 'Accession Number', 'Sequence Length', 'Province']}>
            {biomarkerSummaryRows.map((row) => (
              <tr key={row.biomarkerId} className="border-b border-[var(--app-border)] last:border-b-0">
                <td className="px-4 py-3 font-medium text-[var(--app-text)]">{row.biomarkerId}</td>
                <td className="px-4 py-3 text-[var(--app-muted)]">{row.markerType}</td>
                <td className="px-4 py-3 text-[var(--app-muted)]">{row.species}</td>
                <td className="px-4 py-3 text-[var(--app-muted)]">{row.accession}</td>
                <td className="px-4 py-3 text-[var(--app-muted)]">{row.sequenceLength}</td>
                <td className="px-4 py-3 text-[var(--app-muted)]">{row.province}</td>
              </tr>
            ))}
          </Table>
        </ChartCard>
      </section>
    </VisualizationLayout>
  )
}
