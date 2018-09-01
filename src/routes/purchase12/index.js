import React from 'react'
import Purchase12 from './Purchase12'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    actions: null,
    component: <Purchase12 intl={intl}/>
  }
}

export default action
