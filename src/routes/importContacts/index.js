import React from 'react'
import ImportContacts from './ImportContacts'
import {setCurrentRouteName} from '../../reducers/global'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['contacts'],
    title: 'Import Contacts',
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: 'Import Contacts'},
    ],
    component: <ImportContacts/>,
  }
}

export default action
