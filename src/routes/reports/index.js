import React from 'react'
import {AppLayout} from '../../components'
import Reports from './Reports'
import {setCurrentRouteName} from '../../reducers/global'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['dashboard'],
    title: 'Reports',
    component: <AppLayout><Reports/></AppLayout>,
  }
}

export default action
