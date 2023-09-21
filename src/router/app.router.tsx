import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import DefaultLayout from '@/layout/default/default.layout'
// import BlankLayout from '@/layout/blank/blank.layout'
import ContentSkeleton from '@/components/skeleton/content.skeleton'

const DashboardPage = lazy(() => import('@/view/dashboard/dashboard.page'))
const AboutPage = lazy(() => import('@/view/about.page'))
const UserPage = lazy(() => import('@/view/user/user.page'))
const RolePage = lazy(() => import('@/view/role/role.page'))
const MenuPage = lazy(() => import('@/view/menu/menu.page'))
const ErrorPage = lazy(() => import('@/router/error.page'))

const LoginPage = lazy(() => import('@/view/login.page'))
const RegisterPage = lazy(() => import('@/view/register.page'))

const router = createBrowserRouter([
  {
    path: '',
    element: <Navigate replace to={'/dashboard'} />,
    errorElement: <ErrorPage />,
  },
  // {
  //   path: '/',
  //   element: <Navigate to="/login" />,
  //   errorElement: <ErrorPage />,
  // },
  // {
  //   path: '*',
  //   element: <Navigate to="/404" />,
  //   errorElement: <ErrorPage />,
  // },
  {
    path: '/login',
    element: (
      <Suspense fallback={<>loading Login</>}>
        <LoginPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<>loading Register</>}>
        <RegisterPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={<ContentSkeleton>loading Home</ContentSkeleton>}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={<ContentSkeleton>loading About</ContentSkeleton>}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: '/user',
        element: (
          <Suspense fallback={<ContentSkeleton>loading User</ContentSkeleton>}>
            <UserPage />
          </Suspense>
        ),
      },
      {
        path: '/role',
        element: (
          <Suspense fallback={<ContentSkeleton>loading Role</ContentSkeleton>}>
            <RolePage />
          </Suspense>
        ),
      },
      {
        path: '/menu',
        element: (
          <Suspense fallback={<ContentSkeleton>loading Menu</ContentSkeleton>}>
            <MenuPage />
          </Suspense>
        ),
      },
    ],
  },
])

export { router }
