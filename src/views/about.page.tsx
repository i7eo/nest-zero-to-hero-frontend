import { useCountStore } from '@/stores/app.store'
import { useDataStore } from '@/stores/datasource.store'

const PageAbout: React.FC = () => {
  const zustandCount = useCountStore((state) => state.count)
  const dataState = useDataStore()

  return (
    <section className="page-about">
      <h2>About</h2>
      <h2>
        <span>zustand count: </span>
        <span>{zustandCount}</span>
      </h2>
      <h2>
        <span>mini redux count: </span>
        <span>{dataState.data}</span>
      </h2>
    </section>
  )
}

export default PageAbout
