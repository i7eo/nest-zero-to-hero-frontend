import { ThemeProvider } from "@/components/theme-provider"
import { DataTableDemo } from '@/components/data-table'
 
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DataTableDemo />
    </ThemeProvider>
  )
}
 
export default App
