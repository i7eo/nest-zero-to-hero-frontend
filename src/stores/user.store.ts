import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface IState {
  token: string
}

export interface IAction {
  reset: () => void
  setToken: (token: string) => void
}

const initialState: IState = {
    token: ''
}

const useUserStore = create(
  devtools(
    persist(
      immer<IState & IAction>((set) => ({
        ...initialState,

        reset: () => set(initialState),
        setToken: (token: string) => set({ token })
      })),
      {
        name: 'user-store',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
)

export default useUserStore
