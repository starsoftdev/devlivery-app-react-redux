import React from 'react'
import Purchase8 from './Purchase8'
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
    component: <Purchase8 intl={intl} flowIndex={flowIndex}/>
  }
}

export default action
