import React from 'react'
import {AppLayout} from '../../components'
import Register1 from './Register1'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['register'],
    title: 'Type of Account - Register',
    component: <AppLayout><Register1/></AppLayout>
  }
}

export default action
