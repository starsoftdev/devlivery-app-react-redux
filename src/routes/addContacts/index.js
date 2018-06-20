import React from 'react'
import AddContacts from './AddContacts'
import {setCurrentRouteName} from '../../reducers/global'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['contacts'],
    title: 'New Contact',
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: 'New Contact'},
    ],
    component: <AddContacts/>,
  }
}

export default action
