import React from 'react'
import ContactGroups from './ContactGroups'
import {setCurrentRouteName} from '../../reducers/global'
import {getContactGroups} from '../../reducers/contactGroups'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getContactGroups())

  return {
    chunks: ['contacts'],
    title: 'Contact Groups',
    breadcrumbs: [
      {name: 'Contact Groups'},
    ],
    component: <ContactGroups/>,
  }
}

export default action
