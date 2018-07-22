import React from 'react'
import User from './User'
import {setCurrentRouteName} from '../../reducers/global'
import {getUserDetails} from '../../reducers/user'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getUserDetails())

  return {
    chunks: ['dashboard'],
    title: 'Settings',
    breadcrumbs: [
      {name: 'Settings'},
    ],
    component: <User intl={intl}/>,
  }
}

export default action
