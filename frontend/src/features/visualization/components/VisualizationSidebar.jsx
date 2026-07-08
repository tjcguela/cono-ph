import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import SelectWithChevron from '@/components/ui/SelectWithChevron'
import {
  visualizationFilterOptions,
  visualizationStatusOptions,
} from '@/features/visualization/data/visualizationMockData'

function FilterField({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[var(--app-text)]">{label}</label>
      {children}
    </div>
  )
}

function ToggleRow({ label, defaultChecked = false }) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm font-semibold text-[var(--app-text)]">{label}</span>
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          defaultChecked={defaultChecked}
          aria-label={label}
        />
        <span className="h-6 w-11 rounded-full bg-black/35 transition peer-checked:bg-brand-500" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </span>
    </label>
  )
}

export default function VisualizationSidebar() {
  return (
    <Card className="bg-[#f1eeeb] p-4 sm:p-5">
      <div className="space-y-4">
        <Input aria-label="Search visualizations" placeholder="Search by.." />

        <div className="space-y-4">
          <FilterField label="Project">
            <SelectWithChevron defaultValue={visualizationFilterOptions.project[0]}>
              {visualizationFilterOptions.project.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </FilterField>

          <FilterField label="Subgenus">
            <SelectWithChevron defaultValue={visualizationFilterOptions.subgenus[0]}>
              {visualizationFilterOptions.subgenus.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </FilterField>

          <FilterField label="Province">
            <SelectWithChevron defaultValue={visualizationFilterOptions.province[0]}>
              {visualizationFilterOptions.province.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </FilterField>

          <FilterField label="Municipality">
            <SelectWithChevron defaultValue={visualizationFilterOptions.municipality[0]}>
              {visualizationFilterOptions.municipality.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </FilterField>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-[var(--app-text)]">Status of Data</p>
            <div className="space-y-1.5">
              {visualizationStatusOptions.map((status) => (
                <label key={status} className="flex items-center gap-2 text-sm text-[var(--app-muted)]">
                  <input type="checkbox" className="h-4 w-4 rounded border-[var(--app-border)]" />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          <FilterField label="Sequencing Platform">
            <SelectWithChevron defaultValue={visualizationFilterOptions.sequencingPlatform[0]}>
              {visualizationFilterOptions.sequencingPlatform.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </FilterField>

          <div className="space-y-3">
            <ToggleRow label="Raw Data in NCBI SRA" />
            <ToggleRow label="Has Image" defaultChecked />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="outline" className="bg-white">
          Reset All
        </Button>
        <Button className="bg-brand-700">Apply Filter</Button>
      </div>
    </Card>
  )
}
