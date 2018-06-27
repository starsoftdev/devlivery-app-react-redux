import React from 'react'
import Purchase5 from './Purchase5'
import {setCurrentRouteName} from '../../reducers/global'
import {getCards, getFlowIndex} from '../../reducers/purchase'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getCards())
  const flowIndex = store.dispatch(getFlowIndex(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    header: null,
    component: <Purchase5 intl={intl} flowIndex={flowIndex}/>
  }
}

export default action
