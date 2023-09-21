import { Suspense, lazy } from 'react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { Skeleton } from '../ui/skeleton'
import type { LucideProps } from 'lucide-react'

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof dynamicIconImports
}

// interface IIcon extends Omit<LucideProps, 'ref'> {
//   name?: string
// }

const Icon = ({ name, ...props }: IconProps) => {
  // this is not work, see: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
  const LucideIcon = lazy(dynamicIconImports[name])
  // const LucideIcon = lazy(
  //   () =>
  //     import(`../../../node_modules/lucide-react/dist/esm/icons/${name}.js`),
  // )

  return name ? (
    <Suspense fallback={<Skeleton />}>
      <LucideIcon {...props} />
    </Suspense>
  ) : (
    <Skeleton />
  )
}

export default Icon
