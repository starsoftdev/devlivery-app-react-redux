import React from 'react'
import {AppLayout} from '../../components'
import Register3 from './Register3'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['register'],
    title: 'Team Details - Register',
    component: <AppLayout><Register3/></AppLayout>
  }
}

export default action
