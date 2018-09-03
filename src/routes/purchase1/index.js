import React from 'react'
import Purchase1 from './Purchase1'
import {setCurrentRouteName} from '../../reducers/global'
import {getOccasions, getOccasionTypes} from '../../reducers/purchase'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOccasions(intl))
  store.dispatch(getOccasionTypes())

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    actions: null,
    component: <Purchase1 intl={intl}/>
  }
}

export default action
