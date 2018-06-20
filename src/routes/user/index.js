import React from 'react'
import User from './User'
import {setCurrentRouteName} from '../../reducers/global'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['dashboard'],
    title: 'Settings',
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: 'Settings'},
    ],
    component: <User/>,
  }
}

export default action
