import { useRouteError } from 'react-router-dom'

const PageError: React.FC = () => {
  const error: any = useRouteError()

  return (
    <section className="page-error flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-2xl">Oops!</h1>

      <p>Sorry, an unexpected error has occurred.</p>

      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </section>
  )
}

export default PageError
