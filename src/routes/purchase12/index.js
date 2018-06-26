import React from 'react'
import Purchase12 from './Purchase12'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <Purchase12/>
  }
}

export default action
