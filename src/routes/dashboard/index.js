import React from 'react'
import {AppLayout} from '../../components'
import Dashboard from './Dashboard'

async function action({next, intl}) {
  const child = await next()

  return {
    chunks: ['dashboard'],
    title: child.title,
    component: (
      <AppLayout>
        <Dashboard breadcrumbs={child.breadcrumbs} intl={intl}>{child.component}</Dashboard>
      </AppLayout>
    ),
  }
}

export default action
