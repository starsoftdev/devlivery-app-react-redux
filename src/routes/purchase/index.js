import React from 'react'
import {AppLayout} from '../../components'
import Purchase from './Purchase'
import {setFlow} from '../../reducers/purchase'
import {AUTH_PURCHASE_ROUTES, PURCHASE_ROUTES} from '../'
import isEqual from 'lodash/isEqual'

async function action({store, next, intl}) {
  const child = await next()

  const {flow} = store.getState().purchase
  const {loggedIn} = store.getState().user
  store.dispatch(setFlow((isEqual(flow, PURCHASE_ROUTES) && loggedIn) ? AUTH_PURCHASE_ROUTES : PURCHASE_ROUTES))

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
