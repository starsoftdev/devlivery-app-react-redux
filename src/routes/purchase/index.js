import React from 'react'
import {AppLayout} from '../../components'
import Purchase from './Purchase'

async function action({next, intl}) {
  const child = await next()

  return {
    chunks: ['purchase'],
    title: child.title,
    component: (
      <AppLayout header={child.header}>
        <Purchase intl={intl}>{child.component}</Purchase>
      </AppLayout>
    ),
  }
}

export default action
