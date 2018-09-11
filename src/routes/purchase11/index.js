import React from 'react'
import Purchase11 from './Purchase11'
import {setCurrentRouteName} from '../../reducers/global'
import {makeOrder} from '../../reducers/purchase'
import {getUserDetails} from '../../reducers/user'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getUserDetails())
  store.dispatch(makeOrder())

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <Purchase11 intl={intl}/>,
    actions: null,
  }
}

export default action
