import type { PropsWithChildren } from 'react'

type Props = {}

const BlankLayout: React.FC<PropsWithChildren<Props>> = (props) => {
  return <>{props.children}</>
}

export default BlankLayout
