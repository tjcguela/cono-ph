import { ChevronDown } from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SearchInput from '@/components/ui/SearchInput'
import { cn } from '@/utils/cn'
import { speciesFilterOptions } from '@/features/species/data/speciesExplorerData'

function SelectField({ label, options }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-black">{label}</label>
      <div className="relative">
        <select
          defaultValue={options[0]}
          className={cn(
            'h-11 w-full appearance-none rounded-2xl border border-[var(--app-border)] bg-white px-4 pr-10 text-sm text-[var(--app-text)] outline-none transition',
            'focus:border-brand-300 focus:ring-2 focus:ring-brand-100',
          )}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)]" />
      </div>
    </div>
  )
}

function CheckboxGroup() {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-black">Status of Data</div>
      <div className="space-y-1.5 text-sm text-[var(--app-muted)]">
        {['Published', 'Under Review', 'Unpublished'].map((label) => (
          <label key={label} className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-[var(--app-border)]" />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function ToggleField() {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-black">Raw Data in NCBI SRA</div>
      <button
        type="button"
        aria-pressed="false"
        className="flex h-8 w-14 items-center rounded-full bg-black/45 p-1 transition"
      >
        <span className="h-6 w-6 rounded-full bg-white shadow-sm transition" />
      </button>
    </div>
  )
}

export default function SpeciesExplorerFilters() {
  return (
    <Card className="space-y-5 bg-[#ece8e8] p-4 sm:p-5">
      <div className="space-y-4">
        <SearchInput placeholder="Search by.." aria-label="Search species" />
        <div className="space-y-4">
          <SelectField label="Project" options={speciesFilterOptions.project} />
          <SelectField label="Subgenus" options={speciesFilterOptions.subgenus} />
          <SelectField label="Province" options={speciesFilterOptions.province} />
          <SelectField label="Municipality" options={speciesFilterOptions.municipality} />
          <CheckboxGroup />
          <SelectField label="Organisms Diet" options={speciesFilterOptions.diet} />
          <SelectField label="Sequencing Platform" options={speciesFilterOptions.sequencingPlatform} />
          <ToggleField />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button variant="outline" size="md" className="bg-white text-[var(--app-text)]">
          Reset All
        </Button>
        <Button variant="primary" size="md" className="bg-brand-700">
          Apply Filter
        </Button>
      </div>
    </Card>
  )
}
