import { useState } from 'react'
import { Search } from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import SelectWithChevron from '@/components/ui/SelectWithChevron'
import { cn } from '@/utils/cn'

function TogglePill({ label, enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition',
        enabled
          ? 'border-brand-300 bg-brand-50 text-brand-800'
          : 'border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200',
      )}
    >
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          'inline-flex h-6 w-11 items-center rounded-full p-0.5 transition',
          enabled ? 'justify-end bg-brand-700' : 'justify-start bg-[#b8b8b8]',
        )}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  )
}

function SelectField({ label, value, options = [], onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-black">{label}</label>
      <SelectWithChevron value={value} onChange={(event) => onChange(event.target.value)} selectClassName="pr-12">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectWithChevron>
    </div>
  )
}

export default function PublicationSidebar({
  filters = {},
  options = {},
  onFilterChange = () => {},
}) {
  const [localFilters, setLocalFilters] = useState(filters)

  const updateLocalFilters = (patch) => {
    setLocalFilters((current) => ({ ...current, ...patch }))
  }

  const handleStatusToggle = (status) => {
    const currentStatuses = localFilters.status || []
    const nextStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((item) => item !== status)
      : [...currentStatuses, status]

    updateLocalFilters({ status: nextStatuses })
  }

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      year: 'All Years',
      journal: 'All Journals',
      evidenceType: 'All Evidence Types',
      province: 'All Provinces',
      status: [],
      hasDoi: false,
    }

    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }

  return (
    <Card className="space-y-5 bg-[#ece8e8] p-4 sm:p-5">
      <div className="space-y-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)]" />
          <Input
            type="search"
            placeholder="Search by.."
            aria-label="Search publications"
            value={localFilters.search || ''}
            onChange={(event) => updateLocalFilters({ search: event.target.value })}
            className="pl-11"
          />
        </label>

        <div className="space-y-4">
          <SelectField label="Year" value={localFilters.year || 'All Years'} options={options.year} onChange={(value) => updateLocalFilters({ year: value })} />
          <SelectField label="Journal" value={localFilters.journal || 'All Journals'} options={options.journal} onChange={(value) => updateLocalFilters({ journal: value })} />
          <SelectField label="Evidence Type" value={localFilters.evidenceType || 'All Evidence Types'} options={options.evidenceType} onChange={(value) => updateLocalFilters({ evidenceType: value })} />
          <SelectField label="Province" value={localFilters.province || 'All Provinces'} options={options.province} onChange={(value) => updateLocalFilters({ province: value })} />

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Publication Status</label>
            <div className="space-y-2 rounded-2xl border border-[var(--app-border)] bg-white p-3">
              {(options.status || []).map((status) => (
                <label key={status} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--app-text)]">
                  <input
                    type="checkbox"
                    checked={(localFilters.status || []).includes(status)}
                    onChange={() => handleStatusToggle(status)}
                    className="h-4 w-4 rounded border-[var(--app-border)] text-brand-700 focus:ring-brand-500"
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          <TogglePill
            label="Has DOI"
            enabled={Boolean(localFilters.hasDoi)}
            onClick={() => updateLocalFilters({ hasDoi: !localFilters.hasDoi })}
          />
        </div>
      </div>

      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        <Button variant="outline" size="md" className="bg-white text-[var(--app-text)]" onClick={handleResetFilters}>
          Reset All
        </Button>
        <Button variant="primary" size="md" className="bg-brand-700" onClick={handleApplyFilters}>
          Apply Filter
        </Button>
      </div>
    </Card>
  )
}
