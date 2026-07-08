import {
  Database,
  Globe2,
  Sprout,
} from 'lucide-react'

export const visualizationBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Visualization' },
]

export const visualizationMeta = {
  title: 'Data Visualization',
  subtitle:
    'Shared layout foundation for biodiversity, conopeptide, and biomarker visual summaries.',
}

export const visualizationMetrics = [
  {
    icon: Database,
    value: '127',
    label: 'Total Species',
    description: 'Mock summary label for the shared visualization shell.',
  },
  {
    icon: Sprout,
    value: '3,671',
    label: 'Conopeptide Precursors',
    description: 'Placeholder metric for future conopeptide analytics.',
  },
  {
    icon: Globe2,
    value: '312',
    label: 'Biomarkers',
    description: 'Placeholder metric for future biomarker analytics.',
  },
]

export const visualizationFilterOptions = {
  project: ['All Projects', 'Project A', 'Project B', 'Project C'],
  subgenus: ['All Subgenera', 'Subgenus 1', 'Subgenus 2', 'Subgenus 3'],
  province: ['All Provinces', 'Province 1', 'Province 2', 'Province 3'],
  municipality: ['All Municipalities', 'Municipality 1', 'Municipality 2', 'Municipality 3'],
  sequencingPlatform: ['All Platforms', 'Illumina', 'Oxford Nanopore', 'PacBio'],
}

export const visualizationStatusOptions = ['Published', 'Under Review', 'Unpublished']

export const visualizationPlaceholderSections = [
  {
    title: 'Overview Distribution',
  },
  {
    title: 'Coverage Trend',
  },
  {
    title: 'Geographic Coverage',
  },
  {
    title: 'Summary Table',
  },
]
