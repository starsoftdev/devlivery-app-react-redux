import React from 'react'
import User from './User'
import {setCurrentRouteName} from '../../reducers/global'
import {getUserDetails,getAllCards} from '../../reducers/user'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getUserDetails())
  store.dispatch(getAllCards())
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
