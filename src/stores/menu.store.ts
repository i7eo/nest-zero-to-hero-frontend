import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { IMenu } from '@/typings'

export interface IState {
  menus: IMenu[]
}

export interface IAction {
  reset: () => void
}

const initialState: IState = {
  menus: [
    {
      id: '1',
      name: 'Dashboard',
      path: '/dashboard',
      iconName: 'home',
    },
    {
      id: '2',
      name: 'User',
      path: '/user',
      iconName: 'users',
    },
    {
      id: '3',
      name: 'Role',
      path: '/role',
      iconName: 'user-cog',
    },
    {
      id: '4',
      name: 'Menu',
      path: '/menu',
      iconName: 'menu',
    },
    {
      id: '5',
      name: 'About',
      path: '/about',
      iconName: 'file',
    },
  ],
}

const useMenuStore = create(
  devtools(
    persist(
      immer<IState & IAction>((set) => ({
        ...initialState,

        reset: () => {
          set(initialState)
        },
      })),
      {
        name: 'menu-store',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
)

export default useMenuStore
