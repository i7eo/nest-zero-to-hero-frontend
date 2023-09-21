import { Outlet } from 'react-router-dom'

import SiderBar from './components/sider-bar'
import Content from './components/content'

type Props = {}

const DefaultLayout: React.FC<Props> = () => {
  return (
    <section className="flex h-full">
      <SiderBar />
      <Content children={<Outlet />} />
    </section>
  )
}

export default DefaultLayout
