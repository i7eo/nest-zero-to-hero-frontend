import { Outlet } from 'react-router-dom'

import SiderBar from './components/sider-bar'
import Content from './components/content'

type Props = {}

const DefaultLayout: React.FC<Props> = () => {
  return (
    <>
      <SiderBar />
      <Content children={<Outlet />} />
    </>
  )
}

export default DefaultLayout
