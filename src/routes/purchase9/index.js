import React from 'react'
import Purchase9 from './Purchase9'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getFlowIndex} from '../../reducers/purchase'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  const flowIndex = store.dispatch(getFlowIndex(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <Purchase9 intl={intl} flowIndex={flowIndex}/>
  }
}

export default action
