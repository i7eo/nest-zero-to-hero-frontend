import logo from '@/assets/logo.svg'
import { cn } from '@/utils/shadcn-ui.util'

const ReactLogo: React.FC = () => (
  <>
    <img
      src={logo}
      className={cn(
        'pointer-events-none duration-1000 ease-linear animate-in spin-in-0 spin-out-180 repeat-infinite',
      )}
      alt="logo"
    />
    <p>
      Hello Vite + React + ReactRouter + Zustand + TypeScript + StyledComponents
      + TailwindCSS!
    </p>
  </>
)

export default ReactLogo
