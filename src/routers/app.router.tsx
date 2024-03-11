import { Suspense, lazy } from 'react'
import { Navigate, createHashRouter } from 'react-router-dom'

import DefaultLayout from '@/layouts/default/default.layout'
// import BlankLayout from '@/layout/blank/blank.layout'
import ContentSkeleton from '@/components/skeleton/content.skeleton'

const PageDashboard = lazy(() => import('@/views/dashboard/dashboard.page'))
const PageAbout = lazy(() => import('@/views/about.page'))
const PageUser = lazy(() => import('@/views/user/user.page'))
const PageRole = lazy(() => import('@/views/role/role.page'))
const PageMenu = lazy(() => import('@/views/menu/menu.page'))
const PageError = lazy(() => import('@/routers/error.page'))

const LoginPage = lazy(() => import('@/views/login.page'))
const RegisterPage = lazy(() => import('@/views/register.page'))

const LOADING_MESSAGE = `✨ waiting to load ✨`

const router = createHashRouter([
  {
    path: '',
    element: <Navigate replace to={'/dashboard'} />,
    errorElement: <PageError />,
  },
  // {
  //   path: '/',
  //   element: <Navigate to="/login" />,
  //   errorElement: <PageError />,
  // },
  // {
  //   path: '*',
  //   element: <Navigate to="/404" />,
  //   errorElement: <PageError />,
  // },
  {
    path: '/login',
    element: (
      <Suspense fallback={LOADING_MESSAGE}>
        <LoginPage />
      </Suspense>
    ),
    errorElement: <PageError />,
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={LOADING_MESSAGE}>
        <RegisterPage />
      </Suspense>
    ),
    errorElement: <PageError />,
  },
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <PageError />,
    children: [
      {
        path: '/dashboard',
        element: (
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <PageDashboard />
          </Suspense>
        ),
      },
      {
        path: '/user',
        element: (
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <PageUser />
          </Suspense>
        ),
      },
      {
        path: '/role',
        element: (
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <PageRole />
          </Suspense>
        ),
      },
      {
        path: '/menu',
        element: (
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <PageMenu />
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense
            fallback={<ContentSkeleton>{LOADING_MESSAGE}</ContentSkeleton>}
          >
            <PageAbout />
          </Suspense>
        ),
      },
    ],
  },
])

export { router }
