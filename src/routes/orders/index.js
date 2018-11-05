import React from 'react'
import Orders from './Orders'
import {setCurrentRouteName} from '../../reducers/global'
import {getEvents, getOrders, getUpcomingEvents} from '../../reducers/orders'
import moment from 'moment'
import messages from './messages'
import {getOccasions} from '../../reducers/cards'

function action({params,store, route, intl, query}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOrders())
  store.dispatch(getEvents(moment()))
  store.dispatch(getUpcomingEvents())
  store.dispatch(getOccasions())
  
  return {
    chunks: ['dashboard'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <Orders intl={intl} orderID = {params && params.orderid} recipient_id = {query && query.recipient_id}/>,
  }
}

export default action
