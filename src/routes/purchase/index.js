import React from 'react'
import {AppLayout} from '../../components'
import Purchase from './Purchase'
import {setFlow, setFlowIndex} from '../../reducers/purchase'
import {AUTH_PURCHASE_ROUTES, PURCHASE_ROUTES} from '../'
import isEqual from 'lodash/isEqual'

async function action({store, next, intl}) {
  const child = await next()
  const {loggedIn} = store.getState().user
  const {flow} = store.getState().purchase

  if (isEqual(flow, PURCHASE_ROUTES) && loggedIn) {
    store.dispatch(setFlow(AUTH_PURCHASE_ROUTES))
  } else if (isEqual(flow, AUTH_PURCHASE_ROUTES) && !loggedIn) {
    store.dispatch(setFlow(PURCHASE_ROUTES))
  }
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
