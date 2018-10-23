import React from 'react'
import Purchase13 from './Purchase13'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getAllCards} from '../../reducers/user'
import {makeOrder} from '../../reducers/purchase'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getAllCards())
  store.dispatch(makeOrder())
  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <Purchase13 intl={intl}/>,
    actions: null,
  }
}

export default action
