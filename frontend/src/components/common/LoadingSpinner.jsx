import { Loader } from 'lucide-react'

/**
 * Loading Spinner Component
 * Displays a centered loading indicator
 * 
 * Usage:
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" />
 * <LoadingSpinner label="Loading data..." />
 */
export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader className={`${sizeClasses[size]} animate-spin text-brand-700`} />
      {label && <p className="text-sm text-[var(--app-muted)]">{label}</p>}
    </div>
  )
}
