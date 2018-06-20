import React from 'react'
import Bundles from './Bundles'
import {setCurrentRouteName} from '../../reducers/global'
import {getBundles} from '../../reducers/bundles'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getBundles())

  return {
    chunks: ['dashboard'],
    title: 'Bundles',
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: 'Bundles'},
    ],
    component: <Bundles/>,
  }
}

export default action
