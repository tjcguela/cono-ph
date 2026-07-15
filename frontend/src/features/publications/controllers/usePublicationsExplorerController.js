import { useCallback, useMemo, useState } from 'react'

import {
  publicationExplorerBreadcrumbs,
  publicationExplorerInitialFilters,
  publicationExplorerMeta,
  publicationExplorerRows,
  publicationFilterOptions,
  publicationPagination,
} from '@/features/publications/data/publicationMockData'

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.year) && row.year !== filters.year) return false
  if (!isDefaultOption(filters.journal) && row.journal !== filters.journal) return false
  if (!isDefaultOption(filters.evidenceType) && row.evidenceType !== filters.evidenceType) return false
  if (!isDefaultOption(filters.province) && row.province !== filters.province) return false
  if ((filters.status || []).length > 0 && !filters.status.includes(row.status)) return false
  if (filters.hasDoi && row.doi === 'Unavailable') return false

  return true
}

export function usePublicationsExplorerController() {
  const [filters, setFilters] = useState(publicationExplorerInitialFilters)
  const [page, setPage] = useState(publicationPagination.page)

  const rows = useMemo(
    () => publicationExplorerRows.filter((row) => rowMatchesFilters(row, filters)),
    [filters],
  )

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage)
  }, [])

  return {
    breadcrumbs: publicationExplorerBreadcrumbs,
    filters,
    filterOptions: publicationFilterOptions,
    handleFilterChange,
    handlePageChange,
    meta: publicationExplorerMeta,
    pagination: { ...publicationPagination, page },
    resultCount: `${rows.length.toLocaleString()} results`,
    rows,
  }
}
