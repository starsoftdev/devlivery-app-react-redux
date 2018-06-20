import React from 'react'
import Orders from './Orders'
import {setCurrentRouteName} from '../../reducers/global'
import {getEvents, getOrders} from '../../reducers/orders'
import moment from 'moment'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOrders())
  store.dispatch(getEvents(moment()))

  return {
    chunks: ['dashboard'],
    title: 'Orders',
    component: <Orders/>,
  }
}

export default action
