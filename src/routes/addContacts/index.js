import React from 'react'
import AddContacts from './AddContacts'
import {setCurrentRouteName} from '../../reducers/global'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['contacts'],
    title: 'New Contact',
    breadcrumbs: [
      {name: 'New Contact'},
    ],
    component: <AddContacts/>,
  }
}

export default action
