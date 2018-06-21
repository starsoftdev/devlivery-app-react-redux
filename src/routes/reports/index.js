import React from 'react'
import Reports from './Reports'
import {setCurrentRouteName} from '../../reducers/global'
import {getOccasions, getReports} from '../../reducers/reports'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getReports())
  store.dispatch(getOccasions())

  return {
    chunks: ['dashboard'],
    title: 'Reports',
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: 'Reports'},
    ],
    component: <Reports/>,
  }
}

export default action
