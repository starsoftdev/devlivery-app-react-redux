import React from 'react'
import Orders from './Orders'
import {setCurrentRouteName} from '../../reducers/global'
import {getEvents, getOrders} from '../../reducers/orders'
import moment from 'moment'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'
import messages from './messages'

function action({query, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOrders())
  store.dispatch(getEvents(moment()))

  return {
    chunks: ['dashboard'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <Orders intl={intl}/>,
  }
}

export default action
