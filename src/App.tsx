// import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider } from '@/components/theme-provider'
import { router } from '@/router/app.router'

import './style/app.style.css'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <SWRConfig
        value={{
          suspense: true,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <ErrorBoundary fallback={<div>error...</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </ErrorBoundary>
      </SWRConfig> */}
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <ErrorBoundary fallback={<div>error...</div>}>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </SWRConfig>
    </ThemeProvider>
  )
}

export default App
