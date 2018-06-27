import React from 'react'
import {AppLayout} from '../../components'
import Purchase from './Purchase'
import {setFlow, setFlowIndex} from '../../reducers/purchase'
import {AUTH_PURCHASE_ROUTES, PURCHASE_ROUTES} from '../'

async function action({store, next, intl}) {
  const child = await next()

  const {loggedIn} = store.getState().user
  // TODO change it when other flows are added
  store.dispatch(setFlow(loggedIn ? AUTH_PURCHASE_ROUTES : PURCHASE_ROUTES))
  store.dispatch(setFlowIndex())

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
