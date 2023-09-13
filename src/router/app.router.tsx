import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import DefaultLayout from '@/layout/default/default.layout'
// import BlankLayout from '@/layout/blank/blank.layout'

const HomePage = lazy(() => import('@/view/home/home.page'))
const AboutPage = lazy(() => import('@/view/about.page'))
const UsersPage = lazy(() => import('@/view/user/user.page'))
const ErrorPage = lazy(() => import('@/view/error.page'))

const LoginPage = lazy(() => import('@/view/login.page'))
const RegisterPage = lazy(() => import('@/view/register.page'))

const router = createBrowserRouter([
  {
    path: '',
    element: <Navigate replace to={'/home'} />,
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
        path: '/home',
        element: (
          <Suspense fallback={<>loading Home</>}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={<>loading About</>}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: '/user',
        element: (
          <Suspense fallback={<>loading User</>}>
            <UsersPage />
          </Suspense>
        ),
      },
    ],
  },
])

export { router }
