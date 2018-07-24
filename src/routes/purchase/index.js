import React from 'react'
import {AppLayout} from '../../components'
import Purchase from './Purchase'
import {setFlow, setFlowIndex} from '../../reducers/purchase'
import {AUTH_PURCHASE_FLOW, PURCHASE_FLOW} from '../'

async function action({store, next, intl}) {
  const child = await next()
  const {loggedIn} = store.getState().user
  const {flow} = store.getState().purchase
  if (flow.key === PURCHASE_FLOW.key && loggedIn) {
    store.dispatch(setFlow(AUTH_PURCHASE_FLOW, false))
  } else if (flow.key === AUTH_PURCHASE_FLOW.key && !loggedIn) {
    store.dispatch(setFlow(PURCHASE_FLOW, false))
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
