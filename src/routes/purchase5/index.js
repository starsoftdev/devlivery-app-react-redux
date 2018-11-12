import React from 'react'
import Purchase5 from './Purchase5'
import {setCurrentRouteName} from '../../reducers/global'
import {getCardColors, getCards, getOccasions} from '../../reducers/purchase'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getCards())
  store.dispatch(getCardColors())
  store.dispatch(getOccasions())

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    header: null,
    actions: null,
    component: <Purchase5 intl={intl}/>,
  }
}

export default action
