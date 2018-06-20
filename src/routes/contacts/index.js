import React from 'react'
import Contacts from './Contacts'
import {setCurrentRouteName} from '../../reducers/global'
import {getContacts} from '../../reducers/contacts'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getContacts())

  return {
    chunks: ['contacts'],
    title: 'Find Contacts',
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: 'Find Contacts'},
    ],
    component: <Contacts/>,
  }
}

export default action
