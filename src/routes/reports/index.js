import React from 'react'
import Reports from './Reports'
import {setCurrentRouteName} from '../../reducers/global'
import {getReports} from '../../reducers/reports'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getReports())

  return {
    chunks: ['dashboard'],
    title: 'Reports',
    component: <Reports/>,
  }
}

export default action
