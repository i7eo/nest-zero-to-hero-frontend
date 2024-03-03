// import { create } from 'zustand'
// import { devtools } from 'zustand/middleware'

// interface CounterState {
//   counter: number
//   increaseCounter: () => void
//   decreaseCounter: () => void
// }

// export const useCounterStore = create<CounterState>()(
//   devtools(
//     (set) => ({
//       counter: 0,
//       increaseCounter: () => set((state) => ({ counter: state.counter + 1 })),
//       decreaseCounter: () => set((state) => ({ counter: state.counter - 1 })),
//     }),
//     {
//       name: 'app-store'
//     }
//   )
// )

import { create } from 'zustand'

interface CountState {
  count: number
  increase: (by: number) => void
  decrease: (by: number) => void
}

const useCountStore = create<CountState>(
  (set) => ({
    count: 0,
    increase: (by) => set((state) => ({ count: state.count + by })),
    decrease: (by) => set((state) => ({ count: state.count - by })),
  })
)

export { useCountStore }
