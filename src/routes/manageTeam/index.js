import React from 'react'
import ManageTeam from './ManageTeam'
import {setCurrentRouteName} from '../../reducers/global'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['dashboard'],
    title: 'Manage Team',
    component: <ManageTeam/>,
  }
}

export default action
