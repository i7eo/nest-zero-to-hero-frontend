import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/util/shadcn-ui.util'

const navbarList = [
  {
    id: 1,
    label: 'Home',
    name: 'Home',
    path: '/home',
    icon: () => (
      <svg
        className=" h-4 w-4"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 2,
    label: 'About',
    name: 'About',
    path: '/about',
    icon: () => (
      <svg
        className=" h-4 w-4"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  {
    id: 3,
    label: 'User',
    name: 'User',
    path: '/user',
    icon: () => (
      <svg
        className=" h-4 w-4"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

type Props = {}

const SiderBar: React.FC<Props> = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside className="sticky top-0 h-screen w-56">
      <div className="m-4 flex items-center space-x-1">
        <svg
          className=" h-4 w-4"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
        <h1 className="text-lg font-medium">i7eo</h1>
      </div>
      <nav className="space-y-2">
        {navbarList.map(({ path, name, label, icon }) => (
          <button
            key={name}
            className={cn(
              'flex w-full items-center space-x-2 rounded-lg bg-indigo-600 px-2 py-2 hover:bg-indigo-500',
              path === pathname && 'bg-indigo-400',
            )}
            onClick={() => navigate(path)}
          >
            {icon()}
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default SiderBar
