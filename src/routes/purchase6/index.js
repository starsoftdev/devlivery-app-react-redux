import React from 'react'
import Purchase6 from './Purchase6'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {loadCardDetails} from '../../reducers/purchase';

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(loadCardDetails())
  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <Purchase6 intl={intl}/>,
    actions: null,
  }
}

export default action
