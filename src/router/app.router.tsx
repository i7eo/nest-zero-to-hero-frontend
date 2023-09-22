import { Suspense, lazy } from 'react'
import { Navigate, createHashRouter } from 'react-router-dom'

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

const LOADING_MESSAGE = `✨ waiting to load ✨`

const router = createHashRouter([
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
      <Suspense fallback={LOADING_MESSAGE}>
        <LoginPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={LOADING_MESSAGE}>
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
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: '/user',
        element: (
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <UserPage />
          </Suspense>
        ),
      },
      {
        path: '/role',
        element: (
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <RolePage />
          </Suspense>
        ),
      },
      {
        path: '/menu',
        element: (
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <MenuPage />
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <AboutPage />
          </Suspense>
        ),
      },
    ],
  },
])

export { router }
