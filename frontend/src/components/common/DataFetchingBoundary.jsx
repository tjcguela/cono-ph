/**
 * Data Fetching Error Boundary
 * Wraps data-fetching components with error/loading states
 * 
 * Usage:
 * <DataFetchingBoundary loading={loading} error={error} onRetry={refetch}>
 *   <YourComponent />
 * </DataFetchingBoundary>
 */

import ErrorMessage from './ErrorMessage'
import LoadingSpinner from './LoadingSpinner'

export default function DataFetchingBoundary({
  loading = false,
  error = null,
  children,
  onRetry = null,
  loadingLabel = 'Loading...',
  emptyState = null,
  isEmpty = false,
}) {
  if (loading) {
    return <LoadingSpinner label={loadingLabel} />
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage error={error} onDismiss={onRetry} />
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            Try again
          </button>
        )}
      </div>
    )
  }

  if (isEmpty) {
    return emptyState || <div className="text-center text-[var(--app-muted)]">No data found</div>
  }

  return children
}
