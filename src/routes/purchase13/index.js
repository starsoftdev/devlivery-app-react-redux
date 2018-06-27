import React from 'react'
import Purchase13 from './Purchase13'
import {setCurrentRouteName} from '../../reducers/global'
import {getFlowIndex} from '../../reducers/purchase'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  const flowIndex = store.dispatch(getFlowIndex(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <Purchase13 intl={intl} flowIndex={flowIndex}/>
  }
}

export default action
