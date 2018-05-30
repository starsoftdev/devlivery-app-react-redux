import React from 'react'
import {AppLayout} from '../../components'
import Register4 from './Register4'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['register'],
    title: 'Invite People - Register',
    component: <AppLayout><Register4/></AppLayout>
  }
}

export default action
