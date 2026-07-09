import { Component } from 'react'

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-red-50 px-4">
          <div className="space-y-4 rounded-lg border border-red-200 bg-white p-8 text-center max-w-md">
            <div className="text-4xl">⚠️</div>
            <h1 className="text-2xl font-bold text-red-700">Something went wrong</h1>
            <p className="text-sm text-red-600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <details className="text-left">
              <summary className="cursor-pointer text-xs font-semibold text-red-600 hover:text-red-700">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-red-100 p-3 text-xs text-red-900">
                {this.state.error?.stack}
              </pre>
            </details>
            <button
              onClick={this.handleReset}
              className="mt-4 rounded-lg bg-red-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
