const Main: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props

  return <main className="flex-grow p-6">{children}</main>
}

export default Main
