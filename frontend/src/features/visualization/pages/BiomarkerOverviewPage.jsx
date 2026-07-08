import ChartCard from '@/features/visualization/components/ChartCard'
import { DonutChartPlaceholder } from '@/features/visualization/components/ChartPlaceholders'
import MetricCard from '@/features/visualization/components/MetricCard'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import VisualizationSidebar from '@/features/visualization/components/VisualizationSidebar'
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

function CoverageGauge() {
  const withData = biomarkerCoverageData[0].value
  const withoutData = biomarkerCoverageData[1].value

  return (
    <div className="grid place-items-center">
      <div className="relative flex h-[300px] w-[300px] items-center justify-center">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(#566518 0 76%, rgba(226,226,212,0.9) 76% 100%)',
          }}
        />
        <div className="absolute inset-[18px] rounded-full bg-white shadow-sm" />
        <div className="relative z-10 text-center">
          <div className="text-4xl font-semibold text-[var(--app-text)]">76%</div>
          <p className="mt-2 text-sm text-[var(--app-muted)]">Species with biomarker data</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 text-sm text-[var(--app-muted)]">
        <div className="flex items-center justify-between gap-6">
          <span>Species with biomarker data</span>
          <span className="font-medium text-[var(--app-text)]">{withData}%</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span>Species without biomarker data</span>
          <span className="font-medium text-[var(--app-text)]">{withoutData}%</span>
        </div>
      </div>
    </div>
  )
}

function RankedProvinceBar({ label, value, maxValue }) {
  const width = `${Math.max((value / maxValue) * 100, 12)}%`

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_40px] items-center gap-4 text-sm">
      <span className="truncate italic text-[var(--app-muted)]">{label}</span>
      <div className="h-1.5 rounded-full bg-brand-100">
        <div className="h-1.5 rounded-full bg-brand-700" style={{ width }} />
      </div>
      <span className="text-right text-[var(--app-muted)]">{value}</span>
    </li>
  )
}

export default function BiomarkerOverviewPage() {
  const maxProvinceValue = Math.max(...biomarkerDensityByProvince.map((item) => item.value))

  return (
    <VisualizationLayout
      breadcrumbs={biomarkerOverviewBreadcrumbs}
      title={biomarkerOverviewMeta.title}
      subtitle={biomarkerOverviewMeta.subtitle}
      sidebar={<VisualizationSidebar />}
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
            <CoverageGauge />
            <div className="rounded-2xl border border-[var(--app-border)] bg-brand-50/40 px-4 py-3 text-sm text-[var(--app-muted)]">
              Mock coverage split for biomarker presence across sequenced species.
            </div>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <ChartCard title="Biomarker Density by Province" viewAllLabel="View full list" viewAllTo="/visualization/biomarkers">
          <div className="space-y-5">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_40px] gap-4 text-xs text-[var(--app-muted)]">
              <span>Province</span>
              <span>Number of Biomarker Records</span>
              <span />
            </div>
            <ul className="space-y-4">
              {biomarkerDensityByProvince.map((item) => (
                <RankedProvinceBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  maxValue={maxProvinceValue}
                />
              ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard title="Top Biomarker Records" viewAllLabel="View full list" viewAllTo="/visualization/biomarkers" className="xl:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-brand-50/70 text-xs uppercase tracking-wide text-[var(--app-muted)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Biomarker ID</th>
                    <th className="px-4 py-3 font-medium">Marker Type</th>
                    <th className="px-4 py-3 font-medium">Species</th>
                    <th className="px-4 py-3 font-medium">Accession Number</th>
                    <th className="px-4 py-3 font-medium">Sequence Length</th>
                    <th className="px-4 py-3 font-medium">Province</th>
                  </tr>
                </thead>
                <tbody>
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
                </tbody>
              </table>
            </div>
          </div>
        </ChartCard>
      </section>
    </VisualizationLayout>
  )
}
