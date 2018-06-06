import React from 'react'
import {generateUrl} from '../router'
import {logout} from '../reducers/user'

export const HOME_ROUTE = 'home'
export const LOGIN_ROUTE = 'login'
export const REGISTER1_ROUTE = 'register1'
export const REGISTER2_ROUTE = 'register2'
export const REGISTER3_ROUTE = 'register3'
export const REGISTER4_ROUTE = 'register4'
export const RESET_PASSWORD_ROUTE = 'reset-password'
export const SET_PASSWORD_ROUTE = 'set-password'

export const LOGOUT_ROUTE = 'logout'

export const PURCHASE1_ROUTE = 'purchase1'
export const PURCHASE2_ROUTE = 'purchase2'
export const PURCHASE3_ROUTE = 'purchase3'
export const PURCHASE4_ROUTE = 'purchase4'
export const PURCHASE5_ROUTE = 'purchase5'
export const PURCHASE6_ROUTE = 'purchase6'
export const PURCHASE7_ROUTE = 'purchase7'

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
    {
      path: '/register',
      name: REGISTER1_ROUTE,
      load: () => import(/* webpackChunkName: 'register' */ './register1'),
    },
    {
      path: '/register/individual-details',
      name: REGISTER2_ROUTE,
      load: () => import(/* webpackChunkName: 'register' */ './register2'),
    },
    {
      path: '/register/team-details',
      name: REGISTER3_ROUTE,
      load: () => import(/* webpackChunkName: 'register' */ './register3'),
    },
    {
      path: '/register/invite-people',
      name: REGISTER4_ROUTE,
      load: () => import(/* webpackChunkName: 'register' */ './register4'),
    },
    {
      path: '/reset-password',
      name: RESET_PASSWORD_ROUTE,
      load: () => import(/* webpackChunkName: 'resetPassword' */ './resetPassword'),
    },
    {
      path: '/set-password',
      name: SET_PASSWORD_ROUTE,
      load: () => import(/* webpackChunkName: 'setPassword' */ './setPassword'),
    },

    // Guest Purchase Flow
    {
      path: '/purchase',
      name: PURCHASE1_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase1'),
    },
    {
      path: '/purchase/lettering-technique',
      name: PURCHASE2_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase2'),
    },
    {
      path: '/purchase/card-style',
      name: PURCHASE3_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase3'),
    },
    {
      path: '/purchase/card-size',
      name: PURCHASE4_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase4'),
    },
    {
      path: '/purchase/card',
      name: PURCHASE5_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase5'),
    },
    {
      path: '/purchase/personalize-card',
      name: PURCHASE6_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase6'),
    },
    {
      path: '/purchase/gift-type',
      name: PURCHASE7_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase7'),
    },

    authRoutes,
    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'notFound' */ './notFound'),
    },
  ],

  async action({next}) {
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
