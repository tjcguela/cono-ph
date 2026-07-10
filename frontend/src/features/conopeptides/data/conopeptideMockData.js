import { Database, Layers3, FileCheck2, Sparkles } from 'lucide-react'

export const conopeptideExplorerBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Conopeptides' },
]

export const conopeptideExplorerMeta = {
  title: 'Conopeptides Explorer',
  subtitle: 'Explore conopeptide precursors and predicted mature peptides from Philippine cone snails.',
}

export const conopeptideExplorerMetrics = [
  {
    icon: Database,
    value: '3,671',
    label: 'Total Precursors',
    description: 'Across the current curated transcriptomic records.',
  },
  {
    icon: Layers3,
    value: '67',
    label: 'Superfamilies',
    description: 'Grouped by gene family and sequence pattern.',
  },
  {
    icon: Sparkles,
    value: '1,248',
    label: 'Unique Peptides',
    description: 'Distinct predicted mature peptide sequences.',
  },
  {
    icon: FileCheck2,
    value: '56',
    label: 'Species with Data',
    description: 'Species records linked to conopeptide evidence.',
  },
]

export const conopeptideFilterOptions = {
  project: ['All Projects', 'ConoPH Core', 'Visayas Survey', 'Mindanao Survey'],
  superfamily: ['All Superfamilies', 'A', 'M', 'O1', 'O2', 'T', 'I', 'S', 'Unknown'],
  province: ['All Provinces', 'Cebu', 'Bohol', 'Palawan', 'Samar'],
  municipality: ['All Municipalities', 'Oslob', 'Moalboal', 'Danao', 'Bantayan'],
  cysteineFramework: ['All Cysteine Frameworks', 'Framework I', 'Framework II', 'Framework III', 'Framework VI/VII'],
  status: ['Published', 'Under Review', 'Unpublished'],
}

export const conopeptideExplorerRows = [
  {
    accession: 'ConoPH0001',
    superfamily: 'M',
    framework: 'MII',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin KIIIA',
    species: 'Conus magus',
    province: 'Cebu',
  },
  {
    accession: 'ConoPH0002',
    superfamily: 'O1',
    framework: 'O1',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin G',
    species: 'Conus eburneus',
    province: 'Cebu',
  },
  {
    accession: 'ConoPH0003',
    superfamily: 'T',
    framework: 'T',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conomarphin',
    species: 'Conus tessulatus',
    province: 'Palawan',
  },
  {
    accession: 'ConoPH0004',
    superfamily: 'A',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Contulakin-G',
    species: 'Conus mustelinus',
    province: 'Bohol',
  },
  {
    accession: 'ConoPH0005',
    superfamily: 'M',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin PnIA',
    species: 'Conus imperialis',
    province: 'Cebu',
  },
  {
    accession: 'ConoPH0006',
    superfamily: 'S',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin SxVIIA',
    species: 'Conus striatus',
    province: 'Samar',
  },
  {
    accession: 'ConoPH0007',
    superfamily: 'O2',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin RgIA',
    species: 'Conus rolani',
    province: 'Palawan',
  },
  {
    accession: 'ConoPH0008',
    superfamily: 'I',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin ImI',
    species: 'Conus miles',
    province: 'Bohol',
  },
  {
    accession: 'ConoPH0009',
    superfamily: 'M',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin AuIB',
    species: 'Conus capitaneus',
    province: 'Cebu',
  },
  {
    accession: 'ConoPH0010',
    superfamily: 'A',
    framework: 'A',
    predictedPeptide: 'GCCSHPACG...',
    matchedToxin: 'Conotoxin MrIA',
    species: 'Conus litteratus',
    province: 'Palawan',
  },
]

export const conopeptidePagination = {
  page: 1,
  totalPages: 68,
}

export const conopeptideDetailRecords = [
  {
    accession: 'ConoPH0001',
    title: 'ConoPH0001',
    subtitle: 'Conopeptide Precursor',
    summaryStats: [
      { value: '67', label: 'Superfamilies' },
      { value: '67', label: 'Superfamilies' },
      { value: '67', label: 'Superfamilies' },
      { value: '67', label: 'Superfamilies' },
      { value: '67', label: 'Superfamilies' },
      { value: '67', label: 'Superfamilies' },
    ],
    predictedPeptide: 'GCCSHPACGKGRRC',
    predictedPeptideMarkers: ['1', '5', '10', '15'],
    about:
      'Predicted mature conopeptide cleaved from the precursor sequence and curated from transcriptomic evidence.',
    matchedToxin: {
      name: 'Conotoxin KIIIA',
      summary:
        'Potent inhibitor of voltage-gated sodium channels (Nav). Associated with analgesic effects.',
      reference:
        'Lewis, R.J., Garcia, M.L. (2003) Toxicon, 42(2), 135–149',
      referenceAction: 'View in Reference',
    },
    precursorSequence: '',
    precursorMetadata: {
      length: '60 nucleotides (nt)',
      translation: '20 amino acids (aa)',
    },
    translatedPrecursor:
      'MKTILLLLALALVQGQGCCSHPACGKGRRCLPKTALVQAGGCCSHPACGKGRR',
    additionalInformation: [
      { label: 'Accession', value: 'ConoPH0001' },
      { label: 'Transcript ID', value: 'TRINITY_DN100_c0_g1_i1' },
      { label: 'Data Status', value: 'Published' },
      { label: 'Project', value: 'Project 1 - Anti-Pain and Anti-Neurodegeneration Drug Candidates' },
      { label: 'Specimen ID', value: 'UPD-MSI-CTEX-001' },
      { label: 'Collection Date', value: '2022-07-15' },
      { label: 'Sequencing Platform', value: 'Illumina NovaSeq 6000' },
    ],
    tabs: ['Overview', 'Conopeptides', 'Specimens', 'Publications', 'Sequences'],
  },
]

export const defaultConopeptideDetailId = conopeptideDetailRecords[0].accession
