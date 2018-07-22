import React from 'react'
import Purchase11 from './Purchase11'
import {setCurrentRouteName} from '../../reducers/global'
import {makeOrder} from '../../reducers/purchase'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(makeOrder())

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <Purchase11 intl={intl}/>
  }
}

export default action
