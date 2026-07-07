import { useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import SearchInput from '@/components/ui/SearchInput'
import { cn } from '@/utils/cn'

import { defaultSpeciesDetailId, speciesDetailRecords } from '@/features/species/data/speciesDetailData'

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Conopeptides', value: 'conopeptides' },
  { label: 'Specimens', value: 'specimens' },
  { label: 'Publications', value: 'publications' },
]

function InfoList({ items }) {
  return (
    <dl className="space-y-0">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            'grid grid-cols-1 gap-2 py-5 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:gap-4',
            index !== items.length - 1 && 'border-b border-[#e6e1dc]',
          )}
        >
          <dt className="text-[1.05rem] font-semibold text-[var(--app-muted)]">{item.label}</dt>
          <dd className="text-[1.03rem] leading-7 text-[var(--app-text)] sm:text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function SectionCard({ title, children, className }) {
  return (
    <Card className={cn('!p-0 overflow-hidden', className)}>
      <div className="rounded-t-2xl bg-brand-700 px-5 py-4 text-center text-[1.05rem] font-semibold text-white">
        {title}
      </div>
      <div className="overflow-hidden rounded-b-[1.15rem] px-5 py-2">{children}</div>
    </Card>
  )
}

function StatItem({ value, label }) {
  return (
    <div className="flex min-h-[100px] flex-col items-center justify-center px-3 py-4 text-center">
      <div className="text-[2rem] font-semibold leading-none text-brand-700">{value}</div>
      <div className="mt-3 max-w-[10rem] text-[1rem] leading-6 text-[var(--app-muted)]">{label}</div>
    </div>
  )
}

function ConopeptidesTab({ species }) {
  const totalCount = species.statistics[0]?.value ?? species.conopeptides.length
  const [page, setPage] = useState(1)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="font-serif text-[clamp(2.4rem,3.8vw,3.8rem)] leading-none text-black">
          Conopeptides <span className="text-brand-700">({totalCount})</span>
        </h2>
        <p className="max-w-3xl text-[1rem] leading-7 text-[var(--app-muted)]">
          Predicted conopeptides identified from transcriptomic data for this species.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <SearchInput placeholder="Search conopeptides..." className="w-full lg:max-w-md" />

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <select className="h-11 rounded-2xl border border-[var(--app-border)] bg-white px-4 text-sm text-[var(--app-text)] outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100">
            <option>Gene Superfamily</option>
            <option>M</option>
            <option>O1</option>
            <option>T</option>
            <option>A</option>
          </select>

          <select className="h-11 rounded-2xl border border-[var(--app-border)] bg-white px-4 text-sm text-[var(--app-text)] outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100">
            <option>Cysteine Framework</option>
            <option>Framework III</option>
            <option>Framework VI/VII</option>
            <option>Framework XII</option>
          </select>

          <Button variant="outline" size="md" className="px-5">
            Filter
          </Button>

          <Button variant="outline" size="md" className="px-5">
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse">
            <thead className="bg-brand-50">
              <tr className="text-left text-sm font-semibold text-brand-800">
                <th className="px-5 py-4">Conopeptide ID</th>
                <th className="px-5 py-4">Gene Superfamily</th>
                <th className="px-5 py-4">Framework</th>
                <th className="px-5 py-4">Specimen ID</th>
                <th className="px-5 py-4">Publication</th>
              </tr>
            </thead>
            <tbody>
              {species.conopeptides.map((row) => (
                <tr key={row.conopeptideId} className="border-t border-[var(--app-border)] transition hover:bg-brand-50/60">
                  <td className="px-5 py-4">
                    <Button
                      as={Link}
                      to={`/conopeptides/${row.conopeptideId}`}
                      variant="ghost"
                      className="h-auto justify-start p-0 text-left font-semibold text-brand-700"
                    >
                      {row.conopeptideId}
                    </Button>
                  </td>
                  <td className="px-5 py-4 text-[var(--app-text)]">{row.geneSuperfamily}</td>
                  <td className="px-5 py-4 text-[var(--app-text)]">{row.framework}</td>
                  <td className="px-5 py-4 text-[var(--app-text)]">{row.specimenId}</td>
                  <td className="px-5 py-4 text-[var(--app-text)]">{row.publication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={4} onPageChange={setPage} />
    </div>
  )
}

export default function SpeciesDetailPage() {
  const { speciesId } = useParams()
  const species = useMemo(() => {
    return (
      speciesDetailRecords.find((record) => record.speciesId === speciesId) ??
      speciesDetailRecords.find((record) => record.speciesId === defaultSpeciesDetailId)
    )
  }, [speciesId])

  const [activeTab, setActiveTab] = useState('overview')

  if (!species) {
    return null
  }

  return (
    <div className="space-y-8 pb-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Species', to: '/species' },
          { label: species.species.scientificName },
        ]}
      />

      <section className="grid gap-8 lg:grid-cols-[378px_minmax(0,1fr)] lg:items-start">
        <div className="overflow-hidden rounded-2xl bg-black">
          <img
            src={species.species.image}
            alt={species.species.imageAlt}
            className="h-[265px] w-full object-contain object-center"
          />
        </div>

        <div className="pt-1">
          <h1 className="font-serif text-[clamp(3rem,5vw,5.1rem)] leading-[0.95] text-black">
            {species.species.scientificName}
          </h1>
          <p className="mt-3 text-[clamp(1.45rem,2vw,2rem)] leading-none text-brand-700">
            {species.species.commonName}
          </p>
          <p className="mt-2 text-[1rem] text-[var(--app-muted)]">
            Subgenus: <span className="text-[var(--app-text)]">{species.species.subgenus}</span>
          </p>

          <div className="mt-8 border-t border-brand-300">
            <div className="grid divide-x divide-brand-300 sm:grid-cols-2 xl:grid-cols-5">
              {species.statistics.map((stat) => (
                <StatItem key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-300">
        <div className="flex flex-wrap gap-4 sm:gap-12">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'pb-4 text-[1.15rem] font-medium transition',
                  isActive ? 'text-brand-700' : 'text-brand-700/80 hover:text-brand-700',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </section>

      {activeTab === 'overview' ? (
        <div className="space-y-8">
          <section className="grid gap-8 lg:grid-cols-3">
            <SectionCard title="Taxonomy and Biological Information">
              <InfoList
                items={[
                  { label: 'Scientific Name', value: species.taxonomy.scientificName },
                  { label: 'Common Name', value: species.taxonomy.commonName },
                  { label: 'Organisms Diet', value: species.taxonomy.organismsDiet },
                  { label: 'Subgenus', value: species.taxonomy.subgenus },
                  { label: 'Anatomical Sample', value: species.taxonomy.anatomicalSample },
                  { label: 'Tissue Source', value: species.taxonomy.tissueSource },
                ]}
              />
            </SectionCard>

            <SectionCard title="Collection Information">
              <InfoList
                items={[
                  { label: 'Province', value: species.collection.province },
                  { label: 'Municipality', value: species.collection.municipality },
                  { label: 'Philippine Standard Geographic Code (PSGC)', value: species.collection.psgc },
                  { label: 'Specimen Repository', value: species.collection.specimenRepository },
                ]}
              />
            </SectionCard>

            <SectionCard title="Molecular & Sequencing Information">
              <InfoList
                items={[
                  { label: 'Specimens Sequenced', value: species.molecular.specimensSequenced },
                  { label: 'Total Conopeptides', value: species.molecular.totalConopeptides },
                  { label: 'Total Gene Superfamilies', value: species.molecular.totalGeneSuperfamilies },
                  { label: 'Sequencing Platform', value: species.molecular.sequencingPlatform },
                  { label: 'COI Marker', value: species.molecular.coiMarker },
                  {
                    label: 'Raw Data Availability in NCBI SRA',
                    value: species.molecular.rawDataAvailable,
                  },
                  { label: 'SRA Accession', value: species.molecular.sraAccession },
                ]}
              />
            </SectionCard>
          </section>

          <section>
            <Card className="!p-0 overflow-hidden">
              <div className="rounded-t-2xl bg-brand-700 px-5 py-4 text-[1.05rem] font-semibold text-white">
                Publication Information
              </div>

              <div className="grid gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="space-y-8">
                  <div>
                    <p className="text-[1.05rem] font-semibold text-[var(--app-muted)]">DOI</p>
                    <a
                      href={species.publication.doi}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex break-all text-[1rem] text-[var(--app-muted)] underline underline-offset-2 transition hover:text-brand-700"
                    >
                      {species.publication.doi}
                    </a>
                  </div>

                  <div>
                    <p className="text-[1.05rem] font-semibold text-[var(--app-muted)]">Authors</p>
                    <p className="mt-1 max-w-[34rem] text-[1rem] leading-7 text-[var(--app-muted)]">
                      {species.publication.authors}
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-[1.05rem] font-semibold text-[var(--app-muted)]">Title of Paper</p>
                    <p className="mt-1 max-w-[48rem] text-[1rem] leading-7 text-[var(--app-muted)]">
                      {species.publication.title}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[1.05rem] font-semibold text-[var(--app-muted)]">
                        Associated Project
                      </p>
                      <p className="mt-1 text-[1rem] text-[var(--app-muted)]">
                        {species.publication.project}
                      </p>
                    </div>

                    <div className="flex items-end justify-start sm:justify-end">
                      <Button as="a" href={species.publication.doi} target="_blank" rel="noreferrer" className="gap-2 px-5">
                        View Publication
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      ) : activeTab === 'conopeptides' ? (
        <ConopeptidesTab species={species} />
      ) : (
        <Card className="border-dashed bg-white/80 text-center text-[var(--app-muted)]">
          This section is not implemented yet.
        </Card>
      )}
    </div>
  )
}
