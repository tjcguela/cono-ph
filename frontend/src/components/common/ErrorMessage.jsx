/**
 * Error Display Component
 * Shows user-friendly error messages with context
 * 
 * Usage:
 * <ErrorMessage error="Something went wrong" onDismiss={handleDismiss} />
 */

import { AlertTriangle, X } from 'lucide-react'

export default function ErrorMessage({ error, onDismiss, title = 'Error', severity = 'error' }) {
  if (!error) return null

  const severityStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      title: 'text-red-900',
      text: 'text-red-700',
      icon: 'text-red-500',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      title: 'text-yellow-900',
      text: 'text-yellow-700',
      icon: 'text-yellow-500',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'text-blue-900',
      text: 'text-blue-700',
      icon: 'text-blue-500',
    },
  }

  const styles = severityStyles[severity] || severityStyles.error

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-4`}>
      <div className="flex gap-3">
        <AlertTriangle className={`h-5 w-5 shrink-0 ${styles.icon} mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${styles.title}`}>{title}</h3>
          <p className={`text-sm ${styles.text} mt-1`}>{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`shrink-0 ${styles.icon} hover:opacity-75 transition`}
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}
