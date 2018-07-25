import React from 'react'
import Orders from './Orders'
import {setCurrentRouteName} from '../../reducers/global'
import {getEvents, getOrders, getOrderById} from '../../reducers/orders'
import moment from 'moment'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOrders())
  store.dispatch(getOrderById(route.orderId))
  store.dispatch(getEvents(moment()))

  return {
    chunks: ['dashboard'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <Orders intl={intl}/>,
  }
}

export default action
