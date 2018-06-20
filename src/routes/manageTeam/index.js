import React from 'react'
import ManageTeam from './ManageTeam'
import {setCurrentRouteName} from '../../reducers/global'
import {getTeam} from '../../reducers/team'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getTeam())

  return {
    chunks: ['dashboard'],
    title: 'Manage Team',
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: 'Manage Team'},
    ],
    component: <ManageTeam/>,
  }
}

export default action
