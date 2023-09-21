import { Skeleton } from '../ui/skeleton'

const ContentSkeleton: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props

  return (
    <main className="flex grow flex-col">
      {/* <nav className="flex items-center justify-end border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <div className="flex items-center space-x-4 py-1">
          <div>
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <Skeleton className="h-8 w-10" />
          <Skeleton className="h-8 w-10" />
        </div>
      </nav> */}
      <section className="flex grow flex-col space-y-4 overflow-hidden p-4">
        <div className="mb-6 flex justify-between space-x-4">
          <Skeleton className="h24 w-24" />
          <div className="grow space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="flex grow flex-col space-y-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <div className="flex grow items-center justify-center">
            <svg
              className="mr-4 h-6 w-6 animate-spin text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {children}
          </div>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </section>
    </main>
  )
}

export default ContentSkeleton
