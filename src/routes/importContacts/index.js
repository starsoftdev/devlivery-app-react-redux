import React from 'react'
import ImportContacts from './ImportContacts'
import {setCurrentRouteName} from '../../reducers/global'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['contacts'],
    title: 'Import Contacts',
    component: <ImportContacts/>,
  }
}

export default action
