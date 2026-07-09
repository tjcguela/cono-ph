/**
 * useAsync Hook
 * Generic hook for handling async operations with loading/error states
 * 
 * Useful for:
 * - Any async data fetching
 * - Generic error handling
 * - Loading state management
 * 
 * Usage:
 * const { data, loading, error, execute } = useAsync(
 *   () => myService.getData(),
 *   true // auto-execute on mount
 * );
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * Generic async handler hook
 * @param {function} asyncFunction - Async function to execute
 * @param {boolean} [autoExecute=false] - Auto-execute on mount
 * @returns {object} - { data, loading, error, execute }
 */
export const useAsync = (asyncFunction, autoExecute = false) => {
  const [state, setState] = useState({
    data: null,
    loading: autoExecute,
    error: null,
  });

  /**
   * Execute the async function
   * @param {...any} args - Arguments to pass to asyncFunction
   * @returns {Promise} - Result of async function
   */
  const execute = useCallback(
    async (...args) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await asyncFunction(...args);
        setState({
          data: response,
          loading: false,
          error: null,
        });
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    [asyncFunction]
  );

  // Auto-execute on mount if requested
  useEffect(() => {
    if (autoExecute) {
      execute();
    }
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
  };
};
