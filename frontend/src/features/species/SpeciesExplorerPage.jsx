import { useState } from 'react'
import SpeciesExplorerCard from '@/features/species/components/SpeciesExplorerCard'
import SpeciesExplorerFilters from '@/features/species/components/SpeciesExplorerFilters'
import SpeciesExplorerPagination from '@/features/species/components/SpeciesExplorerPagination'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import ErrorMessage from '@/components/common/ErrorMessage'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useSpecies } from '@/hooks/useSpecies'
import EmptyState from '@/components/ui/EmptyState'

export default function SpeciesExplorerPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'created_at',
    order: 'DESC',
  })

  const { species, loading, error, pagination, refetch } = useSpecies(filters)

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handleRetry = () => {
    refetch()
  }

  return (
    <div className="space-y-8 pb-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Species' },
        ]}
      />

      <section className="space-y-2">
        <h1 className="text-[clamp(3.25rem,4.6vw,4.6rem)] leading-none text-black">
          Species Explorer
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
          Browse and explore Philippine cone snail species and specimen records.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-28">
          <SpeciesExplorerFilters filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        <section className="space-y-5">
          {/* Header with count */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-brand-700">
              {!loading && pagination.total > 0 
                ? `${pagination.total} Species Found` 
                : loading 
                ? 'Loading...' 
                : 'No species found'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <ErrorMessage 
              error={error} 
              onDismiss={handleRetry}
              title="Failed to load species"
            />
          )}

          {/* Loading State */}
          {loading && <LoadingSpinner label="Loading species..." />}

          {/* Empty State */}
          {!loading && !error && species.length === 0 && (
            <EmptyState
              title="No species found"
              description="Try adjusting your search filters to find what you're looking for."
            />
          )}

          {/* Species List */}
          {!loading && species.length > 0 && (
            <div className="space-y-5">
              {species.map((item) => (
                <SpeciesExplorerCard key={item.id} species={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && species.length > 0 && (
            <SpeciesExplorerPagination
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </section>
      </div>
    </div>
  )
}
