import React from 'react'
import Purchase10 from './Purchase10'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <Purchase10 intl={intl}/>
  }
}

export default action
