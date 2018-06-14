import React from 'react'
import {AppLayout} from '../../components'
import AddContacts from './AddContacts'
import {setCurrentRouteName} from '../../reducers/global'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['contacts'],
    title: 'New Contact',
    component: <AppLayout><AddContacts/></AppLayout>,
  }
}

export default action
