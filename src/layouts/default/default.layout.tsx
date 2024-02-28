import { Outlet } from 'react-router-dom'

import SiderBar from './components/sider-bar'
import Content from './components/content'
import useMenuStore from '@/stores/menu.store'

type Props = {}

const DefaultLayout: React.FC<Props> = () => {
  const menus = useMenuStore((state) => state.menus)
  return (
    <section className="flex h-full">
      <SiderBar menus={menus} />
      <Content children={<Outlet />} />
    </section>
  )
}

export default DefaultLayout
