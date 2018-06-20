import React from 'react'
import ContactGroups from './ContactGroups'
import {setCurrentRouteName} from '../../reducers/global'
import {getContactGroups} from '../../reducers/contacts'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getContactGroups())

  return {
    chunks: ['contacts'],
    title: 'Contact Groups',
    component: <ContactGroups/>,
  }
}

export default action
