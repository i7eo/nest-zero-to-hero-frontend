// import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider } from '@/components/theme-provider'
import { router } from '@/routers/app.router'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

import './styles/app.style.css'

const App: React.FC = () => {
  const { toast } = useToast()

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
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          onError: (error) => {
            if (error.status !== 403 && error.status !== 404) {
              toast({
                title: 'HTTP Error ',
                description: `
                  ${error},
                  Please refresh page try again.
                `,
                action: (
                  <ToastAction altText="Refresh Page">Refresh Page</ToastAction>
                ),
              })
            }
          },
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
