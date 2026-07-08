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
        <span className={`h-5 w-5 shrink-0 rounded-sm border border-[var(--app-border)] ${color}`} />
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
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {biomarkerOverviewMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            icon={metric.icon}
            value={metric.value}
            label={metric.label}
            className="p-3 sm:p-4"
          />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-start">
        <ChartCard
          title="Biomarker Type Distribution"
          subtitle="Composition-first view of marker usage across sequenced species."
          viewAllLabel="View full list"
          viewAllTo="/visualization/biomarkers"
          className="h-full"
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-center">
            <div className="grid place-items-center">
              <DonutChartPlaceholder className="min-h-[340px] w-full max-w-[430px]" />
            </div>

            <div className="space-y-4 rounded-3xl border border-[var(--app-border)] bg-brand-50/40 p-4 sm:p-5">
              <h3 className="text-base font-medium text-[var(--app-muted)]">Legend</h3>
              <p className="text-sm leading-6 text-[var(--app-muted)]">
                Marker-type proportions and their record counts are shown together for quick scanning.
              </p>
              <ul className="space-y-3 pt-1">
                {biomarkerTypeLegend.map((item) => (
                  <LegendItem key={item.label} {...item} />
                ))}
              </ul>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Biomarker Coverage Across Species"
          subtitle="Coverage split paired with the type composition view."
          viewAllLabel="View full list"
          viewAllTo="/visualization/biomarkers"
          className="h-full"
        >
          <div className="space-y-5">
            <GaugePlaceholder
              value={biomarkerCoverageData[0].value}
              label={biomarkerCoverageData[0].label}
              details={`${biomarkerCoverageData[1].label}: ${biomarkerCoverageData[1].value}%`}
              className="min-h-[440px]"
            />
            <div className="rounded-2xl border border-[var(--app-border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--app-muted)]">
              Species with biomarker data are shown as the dominant coverage segment.
            </div>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <ChartCard
          title="Biomarker Density by Province"
          subtitle="Supporting province-level record density."
          viewAllLabel="View full list"
          viewAllTo="/visualization/biomarkers"
          className="h-full"
        >
          <BarChartPlaceholder
            items={biomarkerDensityByProvince}
            yAxisLabel="Number of Biomarker Records"
            xAxisLabel="Province"
            className="min-h-[360px]"
          />
        </ChartCard>

        <ChartCard
          title="Top Biomarker Records"
          subtitle="Definitive evidence layer for biomarker records and accessions."
          viewAllLabel="View full list"
          viewAllTo="/visualization/biomarkers"
          className="xl:col-span-1"
        >
          <Table
            columns={['Biomarker ID', 'Marker Type', 'Species', 'Accession Number', 'Sequence Length', 'Province']}
            className="shadow-none"
          >
            {biomarkerSummaryRows.map((row) => (
              <tr key={row.biomarkerId} className="border-b border-[var(--app-border)] last:border-b-0">
                <td className="px-4 py-4 font-medium text-[var(--app-text)]">{row.biomarkerId}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.markerType}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.species}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.accession}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.sequenceLength}</td>
                <td className="px-4 py-4 text-[var(--app-muted)]">{row.province}</td>
              </tr>
            ))}
          </Table>
        </ChartCard>
      </section>
    </VisualizationLayout>
  )
}
