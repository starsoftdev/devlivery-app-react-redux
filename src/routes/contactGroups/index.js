import React from 'react'
import ContactGroups from './ContactGroups'
import {setCurrentRouteName} from '../../reducers/global'
import {getContactGroups} from '../../reducers/contactGroups'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getContactGroups())

  return {
    chunks: ['contacts'],
    title: 'Contact Groups',
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: 'Contact Groups'},
    ],
    component: <ContactGroups/>,
  }
}

export default action
