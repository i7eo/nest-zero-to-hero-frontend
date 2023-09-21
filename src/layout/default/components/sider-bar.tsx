import { useLocation, useNavigate } from 'react-router-dom'
import type { IMenu } from '@/typings'
import { cn } from '@/util/shadcn-ui.util'
import { Button } from '@/components/ui/button'
import Icon from '@/components/icon'

type Props = {
  menus: IMenu[]
}

const SiderBar: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside className="sticky top-0 w-80 bg-gray-100 text-gray-800 dark:bg-background dark:text-foreground">
      <div className="flex items-center border-b p-4">
        <Button variant="ghost">
          <svg
            className="mr-2 h-5 w-5"
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
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
          <span className="sr-only">Dashboard</span>
          <h1 className="text-lg font-medium">Dashboard</h1>
        </Button>
      </div>
      <nav className="space-y-4 p-4">
        {props.menus.map(({ id, path, name, iconName }) => (
          <button
            key={`${id}-${name}`}
            className={cn(
              'flex w-full items-center space-x-4 rounded-lg p-4 active:bg-gray-300',
              path === pathname
                ? 'bg-gray-200 text-gray-800 dark:bg-accent dark:text-foreground'
                : 'text-gray-500 hover:bg-gray-200 dark:text-foreground dark:hover:bg-accent',
            )}
            onClick={() => navigate(path)}
          >
            <Icon name={iconName} className="h-5 w-5" />
            <span className="text-sm font-medium">{name}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default SiderBar
