import React from 'react'
import Purchase3 from './Purchase3'
import {setCurrentRouteName} from '../../reducers/global'
import {getCardStyles, getFlowIndex} from '../../reducers/purchase'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getCardStyles())
  const flowIndex = store.dispatch(getFlowIndex(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <Purchase3 intl={intl} flowIndex={flowIndex}/>
  }
}

export default action
