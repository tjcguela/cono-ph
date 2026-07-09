/**
 * Toast Notification Hook
 * Wrapper around react-hot-toast for consistent notifications
 * 
 * Usage:
 * const toast = useToast();
 * toast.success('Success message');
 * toast.error('Error message');
 */

import { useCallback } from 'react'
import { Toaster, toast as hotToast } from 'react-hot-toast'

export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </>
  )
}

export function useToast() {
  return {
    /**
     * Show success toast
     */
    success: useCallback((message) => {
      hotToast.success(message, {
        icon: '✓',
        style: {
          background: '#dcfce7',
          color: '#166534',
        },
      })
    }, []),

    /**
     * Show error toast
     */
    error: useCallback((message) => {
      hotToast.error(message, {
        icon: '✕',
        style: {
          background: '#fee2e2',
          color: '#991b1b',
        },
      })
    }, []),

    /**
     * Show loading toast
     */
    loading: useCallback((message) => {
      return hotToast.loading(message, {
        style: {
          background: '#f3f4f6',
          color: '#1f2937',
        },
      })
    }, []),

    /**
     * Update existing toast
     */
    update: useCallback((toastId, message, type = 'success') => {
      hotToast.dismiss(toastId)
      if (type === 'success') {
        hotToast.success(message)
      } else if (type === 'error') {
        hotToast.error(message)
      }
    }, []),

    /**
     * Dismiss all toasts
     */
    dismissAll: useCallback(() => {
      hotToast.remove()
    }, []),
  }
}
