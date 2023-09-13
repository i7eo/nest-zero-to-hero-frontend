import { createMiniReduxStore, useMiniReduxStore } from '@/util/mini-redux.util'

type State = { data: number }
type Action = { type: 'ADD' } | { type: 'MULTIPLY'; value: number }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'ADD':
      return { data: state.data + 1 }

    case 'MULTIPLY':
      return { data: state.data * action.value }

    default:
      return state
  }
}

const initialState = { data: 0 }

const store = createMiniReduxStore<Action, State>(reducer, initialState)

const useDataStore = () => {
  return useMiniReduxStore(store)
}

const useDataDispatch = () => {
  return store.dispatch
}

export { useDataStore, useDataDispatch }
