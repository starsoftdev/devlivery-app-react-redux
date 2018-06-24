import React from 'react'
import User from './User'
import {setCurrentRouteName} from '../../reducers/global'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['dashboard'],
    title: 'Settings',
    breadcrumbs: [
      {name: 'Settings'},
    ],
    component: <User/>,
  }
}

export default action
