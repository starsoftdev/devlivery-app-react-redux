import React from 'react'
import {AppLayout} from '../../components'
import Contacts from './Contacts'
import {setCurrentRouteName} from '../../reducers/global'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['contacts'],
    title: 'Find Contacts',
    component: <AppLayout><Contacts/></AppLayout>,
  }
}

export default action
