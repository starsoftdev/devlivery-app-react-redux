import React from 'react'
import Purchase1 from './Purchase1'
import {setCurrentRouteName} from '../../reducers/global'
import {getFlowIndex, getOccasions} from '../../reducers/purchase'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOccasions())
  const flowIndex = store.dispatch(getFlowIndex(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <Purchase1 intl={intl} flowIndex={flowIndex}/>
  }
}

export default action
