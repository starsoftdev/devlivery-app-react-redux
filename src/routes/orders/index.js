import React from 'react'
import Orders from './Orders'
import {setCurrentRouteName} from '../../reducers/global'
import {getEvents, getOrders} from '../../reducers/orders'
import moment from 'moment'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOrders())
  store.dispatch(getEvents(moment()))

  return {
    chunks: ['dashboard'],
    title: 'Orders',
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: 'Orders'},
    ],
    component: <Orders/>,
  }
}

export default action
