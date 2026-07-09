import { RouterProvider } from 'react-router-dom'

import { router } from '@/router/index.jsx'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { ToastProvider } from '@/utils/toastUtils'

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  )
}
