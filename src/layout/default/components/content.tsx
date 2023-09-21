import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Main: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props

  return (
    <main className="flex grow flex-col">
      <nav className="flex items-center justify-end border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <div className="flex items-center space-x-4">
          <div>
            <Input type="text" placeholder="search..." />
          </div>
          <Button size="icon" variant="ghost">
            <svg
              className=" h-5 w-5 text-zinc-500 dark:text-zinc-400"
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
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span className="sr-only">Toggle dark mode</span>
          </Button>
          <Button size="icon" variant="ghost">
            <svg
              className=" h-5 w-5 text-zinc-500 dark:text-zinc-400"
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
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="sr-only">View notifications</span>
          </Button>
        </div>
      </nav>
      <section className="grow overflow-hidden">{children}</section>
    </main>
  )
}

export default Main
