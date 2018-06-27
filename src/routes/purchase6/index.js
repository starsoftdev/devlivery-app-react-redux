import React from 'react'
import Purchase6 from './Purchase6'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getFlowIndex} from '../../reducers/purchase'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  const flowIndex = store.dispatch(getFlowIndex(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    header: null,
    component: <Purchase6 intl={intl} flowIndex={flowIndex}/>
  }
}

export default action
