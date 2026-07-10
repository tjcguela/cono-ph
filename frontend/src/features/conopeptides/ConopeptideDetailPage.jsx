import { useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import {
  conopeptideDetailRecords,
  defaultConopeptideDetailId,
} from '@/features/conopeptides/data/conopeptideMockData'

const tabs = ['Overview', 'Conopeptides', 'Specimens', 'Publications', 'Sequences']

function SummaryStatCard({ value, label }) {
  return (
    <Card className="flex min-h-[152px] items-center justify-center rounded-3xl p-5 text-center">
      <div>
        <div className="text-[2rem] font-semibold leading-none text-[var(--app-text)]">{value}</div>
        <div className="mt-2 text-[1.05rem] font-semibold leading-6 text-brand-700">{label}</div>
      </div>
    </Card>
  )
}

function SectionCard({ title, children, className }) {
  return (
    <Card className={cn('!p-0 overflow-hidden', className)}>
      <div className="px-5 py-4 text-[1.05rem] font-semibold text-brand-700">{title}</div>
      <div className="border-t border-[var(--app-border)] px-5 py-5">{children}</div>
    </Card>
  )
}

function PlaceholderTab({ label }) {
  return (
    <Card className="border-dashed bg-white/80 text-center text-[var(--app-muted)]">
      {label} content coming soon.
    </Card>
  )
}

export default function ConopeptideDetailPage() {
  const { id } = useParams()
  const record = useMemo(() => {
    return (
      conopeptideDetailRecords.find((item) => item.accession === id) ??
      conopeptideDetailRecords.find((item) => item.accession === defaultConopeptideDetailId)
    )
  }, [id])

  const [activeTab, setActiveTab] = useState('Overview')

  if (!record) {
    return null
  }

  return (
    <div className="space-y-8 pb-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Conopeptides', to: '/conopeptides' },
          { label: record.accession },
        ]}
      />

      <section className="space-y-2">
        <h1 className="font-serif text-[clamp(3rem,5vw,5rem)] leading-[0.95] text-black">
          {record.title}
        </h1>
        <p className="text-[1.05rem] text-[var(--app-muted)]">{record.subtitle}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {record.summaryStats.map((stat, index) => (
          <SummaryStatCard key={`${stat.label}-${index}`} value={stat.value} label={stat.label} />
        ))}
      </section>

      <section className="border-b border-[var(--app-border)]">
        <div className="flex flex-wrap gap-4 sm:gap-10">
          {tabs.map((tab) => {
            const isActive = tab === activeTab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-4 text-[1.05rem] font-medium transition',
                  isActive ? 'text-brand-700' : 'text-[var(--app-muted)] hover:text-brand-700',
                )}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </section>

      {activeTab === 'Overview' ? (
        <div className="space-y-8">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <SectionCard title="Predicted Peptide">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-[2rem] tracking-[0.42em] text-[var(--app-text)] sm:text-[2.25rem]">
                  {record.predictedPeptide.split('').map((letter, index) => (
                    <span key={`${letter}-${index}`} className="inline-flex flex-col items-center">
                      <span className="font-mono">{letter}</span>
                      {record.predictedPeptideMarkers.includes(String(index + 1)) ? (
                        <span className="mt-2 text-sm tracking-normal text-brand-700">
                          {String(index + 1)}
                        </span>
                      ) : (
                        <span className="mt-2 text-sm tracking-normal text-transparent">.</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="About">
              <p className="text-[1.05rem] leading-8 text-brand-700">{record.about}</p>
            </SectionCard>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <Card className="!p-0 overflow-hidden">
              <div className="px-5 py-4 text-[1.05rem] font-semibold text-brand-700">Matched Toxin</div>
              <div className="border-t border-[var(--app-border)] px-5 py-5">
                <div className="space-y-4">
                  <h3 className="text-[1.6rem] font-semibold text-[var(--app-text)]">
                    {record.matchedToxin.name}
                  </h3>
                  <p className="max-w-3xl text-[1.02rem] leading-7 text-[var(--app-muted)]">
                    {record.matchedToxin.summary}
                  </p>

                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                    <div className="space-y-2 rounded-2xl border border-[var(--app-border)] bg-brand-50/50 p-4">
                      <p className="text-sm font-semibold text-brand-700">Reference</p>
                      <p className="text-[1rem] leading-7 text-[var(--app-text)]">
                        {record.matchedToxin.reference}
                      </p>
                    </div>

                    <Button type="button" className="gap-2 px-5">
                      {record.matchedToxin.referenceAction}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="!p-0 overflow-hidden">
              <div className="px-5 py-4 text-[1.05rem] font-semibold text-brand-700">Precursor Sequence</div>
              <div className="border-t border-[var(--app-border)] px-5 py-5">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-stretch">
                  <div className="min-h-[168px] rounded-2xl border border-dashed border-brand-200 bg-brand-50/30 p-5">
                    <div className="h-full min-h-[120px]" />
                  </div>
                  <div className="space-y-5 rounded-2xl border border-[var(--app-border)] bg-white p-5">
                    <div>
                      <p className="text-lg font-medium text-[var(--app-muted)]">Length</p>
                      <p className="mt-2 text-[1.35rem] font-semibold text-brand-700">
                        {record.precursorMetadata.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-[var(--app-muted)]">Translation</p>
                      <p className="mt-2 text-[1.35rem] font-semibold text-brand-700">
                        {record.precursorMetadata.translation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <Card className="!p-0 overflow-hidden">
            <div className="px-5 py-4 text-[1.05rem] font-semibold text-brand-700">
              Translated Precursor <span className="font-normal">(with predicted mature peptide highlighted)</span>
            </div>
            <div className="border-t border-[var(--app-border)] px-5 py-5">
              <div className="min-h-[180px] rounded-2xl border border-dashed border-brand-200 bg-brand-50/30 p-5">
                <div className="text-[1rem] leading-8 text-[var(--app-text)]">
                  {record.translatedPrecursor}
                </div>
              </div>
            </div>
          </Card>

          <Card className="!p-0 overflow-hidden">
            <div className="px-5 py-4 text-[1.05rem] font-semibold text-brand-700">
              Additional Information
            </div>
            <div className="border-t border-[var(--app-border)] px-5 py-5">
              <dl className="grid gap-6 lg:grid-cols-2">
                {record.additionalInformation.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-2 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-start"
                  >
                    <dt className="font-semibold text-brand-700">{item.label}</dt>
                    <dd className="text-[var(--app-text)]">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>
        </div>
      ) : (
        <PlaceholderTab label={activeTab} />
      )}
    </div>
  )
}
