import React from 'react'

export const HOME_ROUTE = 'home'

// The top-level (parent) route
const routes = {
  path: '',
  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/',
      name: `${HOME_ROUTE}`,
      action: require('./home').default,
    },
    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    {
      path: '(.*)',
      action: require('./notFound').default,
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
