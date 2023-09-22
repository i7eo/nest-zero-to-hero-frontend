import { Suspense, lazy, useMemo } from 'react'
// import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { Skeleton } from '../ui/skeleton'
import type { LucideProps } from 'lucide-react'

// interface IconProps extends Omit<LucideProps, 'ref'> {
//   name: keyof typeof dynamicIconImports
// }

interface IconProps extends Omit<LucideProps, 'ref'> {
  name?: string
}

function loadIcon(name?: string) {
  return lazy(
    () =>
      import(`../../../node_modules/lucide-react/dist/esm/icons/${name}.js`),
  )
}

const Icon = ({ name, ...props }: IconProps) => {
  // this is not work, see: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
  // const LucideIcon = lazy(dynamicIconImports[name])
  const LucideIcon = useMemo(() => loadIcon(name), [name])

  return name ? (
    <Suspense fallback={<Skeleton className={props.className} />}>
      <LucideIcon {...props} />
    </Suspense>
  ) : (
    <Skeleton className={props.className} />
  )
}

export default Icon
