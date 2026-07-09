/**
 * Error Utilities
 * Centralized error formatting and handling
 */

/**
 * Format error message for user display
 * @param {Error|string} error - Error object or message
 * @returns {string} - User-friendly error message
 */
export function formatError(error) {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    // Check if it's an API error with custom message
    if (error.message) {
      return error.message
    }
    return 'An unexpected error occurred'
  }

  return 'An unexpected error occurred'
}

/**
 * Get error type for styling
 * @param {Error} error - Error object
 * @returns {string} - Error type (e.g., 'validation', 'network', 'server')
 */
export function getErrorType(error) {
  if (error?.status === 400) return 'validation'
  if (error?.status === 404) return 'not-found'
  if (error?.status === 429) return 'rate-limit'
  if (error?.status >= 500) return 'server'
  return 'network'
}

/**
 * Get error icon based on type
 * @param {string} type - Error type
 * @returns {string} - Emoji icon
 */
export function getErrorIcon(type) {
  const icons = {
    validation: '⚠️',
    'not-found': '🔍',
    'rate-limit': '⏱️',
    server: '🚨',
    network: '🔌',
  }
  return icons[type] || '❌'
}

/**
 * Log error for debugging
 * @param {Error} error - Error to log
 * @param {string} context - Where error occurred
 */
export function logError(error, context = 'Unknown') {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error)
  }
}
