import React from 'react'
import Purchase11 from './Purchase11'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <Purchase11 intl={intl}/>
  }
}

export default action
