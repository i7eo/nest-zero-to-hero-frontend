import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { router } from '@/router/app.router'

import './style/app.style.css'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
