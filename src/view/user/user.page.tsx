import { useState } from 'react'

import { useCountStore } from '@/store/app.store'
import { useDataStore } from '@/store/datasource.store'

import useClickOutSide from '@/hook/use-click-outside'

const UserPage: React.FC = () => {
  const zustandCount = useCountStore((state) => state.count)
  const dataState = useDataStore()

  const [text, setText] = useState('undefined')

  const clickRef = useClickOutSide<HTMLDivElement>(
    () => setText(() => 'clickInSide'),
    () => setText(() => 'clickOutSide'),
  )

  return (
    <>
      <h2>Users</h2>
      <h2>
        <span>zustand count: </span>
        <span>{zustandCount}</span>
      </h2>
      <h2>
        <span>mini redux count: </span>
        <span>{dataState.data}</span>
      </h2>

      <div
        ref={clickRef}
        className="rounded-8px mb-5 flex cursor-pointer select-none justify-center bg-black p-5 text-5xl text-white"
      >
        click inside
      </div>

      <div className="font-black">{text}</div>
    </>
  )
}

export default UserPage
