import React from 'react'
import Purchase13 from './Purchase13'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <Purchase13 intl={intl}/>,
    actions: null,
  }
}

export default action
