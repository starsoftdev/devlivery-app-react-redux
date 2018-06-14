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

export const DASHBOARD_ROUTE = 'dashboard'
export const ORDERS_ROUTE = 'orders'
export const MANAGE_TEAM_ROUTE = 'manage-team'
export const REPORTS_ROUTE = 'reports'
export const CONTACTS_ROUTE = 'contacts'
export const IMPORT_CONTACTS_ROUTE = 'import-contacts'
export const ADD_CONTACTS_ROUTE = 'new-contacts'

export const LOGOUT_ROUTE = 'logout'

export const PURCHASE1_ROUTE = 'purchase1'
export const PURCHASE2_ROUTE = 'purchase2'
export const PURCHASE3_ROUTE = 'purchase3'
export const PURCHASE4_ROUTE = 'purchase4'
export const PURCHASE5_ROUTE = 'purchase5'
export const PURCHASE6_ROUTE = 'purchase6'
export const PURCHASE7_ROUTE = 'purchase7'
export const PURCHASE8_ROUTE = 'purchase8'
export const PURCHASE9_ROUTE = 'purchase9'
export const PURCHASE10_ROUTE = 'purchase10'
export const PURCHASE11_ROUTE = 'purchase11'
export const PURCHASE12_ROUTE = 'purchase12'
export const PURCHASE13_ROUTE = 'purchase13'
export const PURCHASE_COMPLETED_ROUTE = 'purchase-completed'

const authRoutes = {
  path: '',
  children: [
    {
      path: '/dashboard',
      name: DASHBOARD_ROUTE,
      load: () => import(/* webpackChunkName: 'dashboard' */ './dashboard'),
      children: [
        {
          path: '/orders',
          name: ORDERS_ROUTE,
          load: () => import(/* webpackChunkName: 'dashboard' */ './orders'),
        },
        {
          path: '/manage-team',
          name: MANAGE_TEAM_ROUTE,
          load: () => import(/* webpackChunkName: 'dashboard' */ './manageTeam'),
        },
        {
          path: '/reports',
          name: REPORTS_ROUTE,
          load: () => import(/* webpackChunkName: 'dashboard' */ './reports'),
        },
        {
          path: '/contacts',
          name: CONTACTS_ROUTE,
          load: () => import(/* webpackChunkName: 'contacts' */ './contacts'),
        },
        {
          path: '/contacts/import',
          name: IMPORT_CONTACTS_ROUTE,
          load: () => import(/* webpackChunkName: 'contacts' */ './importContacts'),
        },
        {
          path: '/contacts/new',
          name: ADD_CONTACTS_ROUTE,
          load: () => import(/* webpackChunkName: 'contacts' */ './addContacts'),
        },
      ],
    },
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
    // TODO
    // if (!loggedIn) {
    //   return {redirect: `/login?next=${pathname}`}
    // }
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
      name: HOME_ROUTE,
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
    {
      path: '/purchase/gift',
      name: PURCHASE8_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase8'),
    },
    {
      path: '/purchase/create-account',
      name: PURCHASE9_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase9'),
    },
    {
      path: '/purchase/add-contacts',
      name: PURCHASE10_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase10'),
    },
    {
      path: '/purchase/confirmation',
      name: PURCHASE11_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase11'),
    },
    {
      path: '/purchase/payment-method',
      name: PURCHASE12_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase12'),
    },
    {
      path: '/purchase/payment',
      name: PURCHASE13_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchase13'),
    },
    {
      path: '/purchase/completed',
      name: PURCHASE_COMPLETED_ROUTE,
      load: () => import(/* webpackChunkName: 'purchase' */ './purchaseCompleted'),
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
