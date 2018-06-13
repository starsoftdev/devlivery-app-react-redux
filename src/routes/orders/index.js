import React from 'react'
import {AppLayout} from '../../components'
import Orders from './Orders'
import {setCurrentRouteName} from '../../reducers/global'
import {getOrders} from '../../reducers/orders'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOrders())

  return {
    chunks: ['dashboard'],
    title: 'Orders',
    component: <AppLayout><Orders/></AppLayout>,
  }
}

export default action
