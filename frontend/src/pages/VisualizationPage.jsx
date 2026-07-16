import { lazy, Suspense } from 'react'

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
  speciesProvinceCoverage,
  speciesTopSequencedSpecies,
} from '@/features/visualization/data/visualizationMockData'

const MetricsSection = lazy(() =>
  import('@/features/visualization/components/VisualizationMetricsSection').then((module) => ({
    default: module.MetricsSection,
  })),
)

const OverviewCardsSection = lazy(() =>
  import('@/features/visualization/components/VisualizationOverviewCardsSection').then((module) => ({
    default: module.OverviewCardsSection,
  })),
)

const TrendsSection = lazy(() =>
  import('@/features/visualization/components/VisualizationTrendsSection').then((module) => ({
    default: module.TrendsSection,
  })),
)

const InsightsSection = lazy(() =>
  import('@/features/visualization/components/VisualizationInsightsSection').then((module) => ({
    default: module.InsightsSection,
  })),
)

function SectionFallback({ className = 'h-64' }) {
  return <div className={`animate-pulse rounded-[1.25rem] border border-[var(--app-border)] bg-white ${className}`} />
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

  const overviewCards = visualizationOverviewCards.map((card) => {
    if (card.id === 'species') {
      return {
        ...card,
        chartData: speciesTopSequencedSpecies.map((item) => ({
          name: item.name,
          value: item.value,
        })),
      }
    }

    if (card.id === 'conopeptides') {
      return {
        ...card,
        chartData: [
          { name: 'A', value: 648 },
          { name: 'M', value: 284 },
          { name: 'O1', value: 173 },
          { name: 'O2', value: 72 },
          { name: 'T', value: 39 },
          { name: 'Unknown', value: 32 },
        ],
      }
    }

    return {
      ...card,
      chartData: biomarkerCoverageData.map((item) => ({
        name: item.label,
        value: item.value,
      })),
    }
  })

  return (
    <VisualizationLayout
      breadcrumbs={visualizationBreadcrumbs}
      title={visualizationMeta.title}
      subtitle={visualizationMeta.subtitle}
    >
      <Suspense fallback={<SectionFallback className="h-28" />}>
        <MetricsSection metrics={visualizationMetrics} />
      </Suspense>

      <Suspense fallback={<SectionFallback className="h-[420px]" />}>
        <OverviewCardsSection cards={overviewCards} />
      </Suspense>

      <Suspense fallback={<SectionFallback className="h-[360px]" />}>
        <TrendsSection
          speciesAreaData={speciesAreaData}
          biomarkerBarData={biomarkerBarData}
          conopeptideLineData={conopeptideLineData}
          biomarkerCoverageData={biomarkerCoverageData}
        />
      </Suspense>

      <Suspense fallback={<SectionFallback className="h-64" />}>
        <InsightsSection insights={visualizationInsights} />
      </Suspense>
    </VisualizationLayout>
  )
}
