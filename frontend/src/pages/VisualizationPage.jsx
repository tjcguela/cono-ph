import ChartCard from '@/features/visualization/components/ChartCard'
import {
  BarChartPlaceholder,
  DonutChartPlaceholder,
  MapPlaceholder,
  TablePlaceholder,
} from '@/features/visualization/components/ChartPlaceholders'
import MetricCard from '@/features/visualization/components/MetricCard'
import VisualizationLayout from '@/features/visualization/components/VisualizationLayout'
import VisualizationSidebar from '@/features/visualization/components/VisualizationSidebar'
import {
  visualizationBreadcrumbs,
  visualizationMeta,
  visualizationMetrics,
  visualizationPlaceholderSections,
} from '@/features/visualization/data/visualizationMockData'

export default function VisualizationPage() {
  return (
    <VisualizationLayout
      breadcrumbs={visualizationBreadcrumbs}
      title={visualizationMeta.title}
      subtitle={visualizationMeta.subtitle}
      sidebar={<VisualizationSidebar />}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visualizationMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            icon={metric.icon}
            value={metric.value}
            label={metric.label}
            description={metric.description}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title={visualizationPlaceholderSections[0].title}>
          <DonutChartPlaceholder />
        </ChartCard>
        <ChartCard title={visualizationPlaceholderSections[1].title}>
          <BarChartPlaceholder />
        </ChartCard>
        <ChartCard title={visualizationPlaceholderSections[2].title}>
          <MapPlaceholder />
        </ChartCard>
        <ChartCard title={visualizationPlaceholderSections[3].title}>
          <TablePlaceholder />
        </ChartCard>
      </section>
    </VisualizationLayout>
  )
}
