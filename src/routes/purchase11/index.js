import React from 'react'
import Purchase11 from './Purchase11'
import {setCurrentRouteName} from '../../reducers/global'
import {getOrderDetails, makeOrder} from '../../reducers/purchase'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  await store.dispatch(makeOrder())
  // TODO remove getOrderDetails - return order details in makeOrder
  store.dispatch(getOrderDetails())

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <Purchase11 intl={intl}/>
  }
}

export default action
