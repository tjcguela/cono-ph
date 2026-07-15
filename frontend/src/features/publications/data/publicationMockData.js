export const publicationExplorerBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Publications' },
]

export const publicationExplorerMeta = {
  title: 'Publications Explorer',
  subtitle: 'Browse publications linked to Philippine cone snail, conopeptide, and biomarker evidence.',
}

export const publicationFilterOptions = {
  year: ['All Years', '2026', '2025', '2024', '2023', '2022'],
  journal: ['All Journals', 'Frontiers in Marine Science', 'Marine Drugs', 'Toxins', 'Molecular Ecology Resources'],
  evidenceType: ['All Evidence Types', 'Species record', 'Conopeptide evidence', 'Biomarker evidence', 'Transcriptome'],
  province: ['All Provinces', 'Cebu', 'Bohol', 'Palawan', 'Marinduque', 'Samar'],
  status: ['Published', 'Under Review', 'Preprint'],
}

export const publicationExplorerInitialFilters = {
  search: '',
  year: 'All Years',
  journal: 'All Journals',
  evidenceType: 'All Evidence Types',
  province: 'All Provinces',
  status: [],
  hasDoi: false,
}

export const publicationExplorerRows = [
  {
    id: 'PUB-2025-001',
    title: 'Integrated transcriptomic and barcode evidence for Philippine cone snail diversity',
    authors: 'Santos, R.; Dela Cruz, M.; Reyes, A.; Villanueva, P.',
    year: '2025',
    journal: 'Frontiers in Marine Science',
    doi: '10.3389/fmars.2025.1616692',
    evidenceType: 'Conopeptide evidence',
    linkedSpecies: 24,
    linkedConopeptides: 148,
    linkedBiomarkers: 18,
    province: 'Cebu',
    status: 'Published',
  },
  {
    id: 'PUB-2025-002',
    title: 'Molecular evidence for cone snail biomarker coverage across Central Visayas',
    authors: 'Navarro, J.; Lim, K.; Bautista, C.',
    year: '2025',
    journal: 'Marine Drugs',
    doi: '10.3390/md23070266',
    evidenceType: 'Biomarker evidence',
    linkedSpecies: 16,
    linkedConopeptides: 42,
    linkedBiomarkers: 31,
    province: 'Marinduque',
    status: 'Published',
  },
  {
    id: 'PUB-2024-003',
    title: 'Conopeptide precursor discovery from Philippine Conus transcriptomes',
    authors: 'Garcia, T.; Mercado, L.; Tan, H.',
    year: '2024',
    journal: 'Toxins',
    doi: '10.3390/toxins16040112',
    evidenceType: 'Transcriptome',
    linkedSpecies: 12,
    linkedConopeptides: 96,
    linkedBiomarkers: 0,
    province: 'Bohol',
    status: 'Published',
  },
  {
    id: 'PUB-2023-004',
    title: 'Reference records for Philippine cone snail species distribution',
    authors: 'Ramos, E.; Cruz, L.; Aquino, S.',
    year: '2023',
    journal: 'Molecular Ecology Resources',
    doi: 'Unavailable',
    evidenceType: 'Species record',
    linkedSpecies: 38,
    linkedConopeptides: 0,
    linkedBiomarkers: 4,
    province: 'Palawan',
    status: 'Under Review',
  },
]

export const publicationPagination = {
  page: 1,
  totalPages: 8,
}
