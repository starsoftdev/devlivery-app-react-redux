import React from 'react'
import ManageTeam from './ManageTeam'
import {setCurrentRouteName} from '../../reducers/global'
import {getTeam} from '../../reducers/team'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getTeam())

  return {
    chunks: ['dashboard'],
    title: 'Manage Team',
    breadcrumbs: [
      {name: 'Manage Team'},
    ],
    component: <ManageTeam/>,
  }
}

export default action
