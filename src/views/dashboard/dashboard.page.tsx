import { useEffect, useState } from 'react'

import ReactLogo from '@/components/logo'
import { useCountStore } from '@/stores/app.store'
import { useDataDispatch, useDataStore } from '@/stores/datasource.store'

const PageDashboard: React.FC = () => {
  const countStore = useCountStore()
  const dataState = useDataStore()
  const dataDispatch = useDataDispatch()

  const [count, setCount] = useState(0)

  useEffect(() => console.log('componentDidMount and count-Update'), [count])

  return (
    <section className="page-dashboard p-4">
      <h2>Home</h2>

      <ReactLogo />

      <button
        className="my-2 rounded-md bg-gray-400 px-4 py-1 text-2xl"
        type="button"
        onClick={() => setCount((count) => count + 1)}
      >
        Add + 1: count is: {count}
      </button>

      <button
        className="my-2 rounded-md bg-gray-400 px-4 py-1 text-2xl"
        type="button"
        onClick={() => countStore.increase(1)}
      >
        Add + 1: zustand count is: {countStore.count}
      </button>

      <button
        className="my-2 rounded-md bg-gray-400 px-4 py-1 text-2xl"
        type="button"
        onClick={() => dataDispatch({ type: 'ADD' })}
      >
        Add + 1: mini redux count is: {dataState.data}
      </button>

      <button
        className="my-2 rounded-md bg-gray-400 px-4 py-1 text-2xl"
        type="button"
        onClick={() => dataDispatch({ type: 'MULTIPLY', value: 2 })}
      >
        Multiply * 2: mini redux count is: {dataState.data}
      </button>

      <p>
        Edit <code>Home.tsx</code> and save to test HMR updates.
      </p>
    </section>
  )
}

export default PageDashboard
