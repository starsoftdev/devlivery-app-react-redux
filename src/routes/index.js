import React from 'react'
import {generateUrl} from '../router'
import {getUser, logout} from '../reducers/user'

export const HOME_ROUTE = 'home'
export const LOGIN_ROUTE = 'login'
export const REGISTER_ROUTE = 'register'
export const FORGOT_PASSWORD_ROUTE = 'forgot-password'
export const SET_PASSWORD_ROUTE = 'set-password'
export const LOGOUT_ROUTE = 'logout'

const authRoutes = {
  path: '',
  children: [
    {
      path: '/logout',
      name: LOGOUT_ROUTE,
      async action({store, query}) {
        await store.dispatch(logout())
        return {redirect: query.next || generateUrl(HOME_ROUTE)}
      },
    },
  ],
  async action({store, next, pathname}) {
    const {loggedIn} = store.getState().user
    if (!loggedIn) {
      return {redirect: `/login?next=${pathname}`}
    }
    return await next()
  },
}

// The top-level (parent) route
const routes = {

  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/',
      name: `${HOME_ROUTE}`,
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/login',
      name: LOGIN_ROUTE,
      load: () => import(/* webpackChunkName: 'login' */ './login'),
    },
    // {
    //   path: '/register',
    //   name: REGISTER_ROUTE,
    //   load: () => import(/* webpackChunkName: 'register' */ './register'),
    // },
    // {
    //   path: '/reset-password',
    //   name: FORGOT_PASSWORD_ROUTE,
    //   load: () => import(/* webpackChunkName: 'forgotPassword' */ './forgotPassword'),
    // },
    // {
    //   path: '/set-password',
    //   name: SET_PASSWORD_ROUTE,
    //   load: () => import(/* webpackChunkName: 'setPassword' */ './setPassword'),
    // },
    authRoutes,
    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'notFound' */ './notFound'),
    },
  ],

  async action({next, store}) {
    await store.dispatch(getUser())
    // Execute each child route until one of them return the result
    const route = await next()

    // Provide default values for title, description etc.
    route.title = `${route.title || ''}`
    route.description = route.description || ''

    return route
  },

}

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  })
}

export default routes
