import React from 'react'
import {AppLayout} from '../../components'
import ImportContacts from './ImportContacts'
import {setCurrentRouteName} from '../../reducers/global'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['contacts'],
    title: 'Import Contacts',
    component: <AppLayout><ImportContacts/></AppLayout>,
  }
}

export default action
