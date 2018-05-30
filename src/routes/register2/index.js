import React from 'react'
import {AppLayout} from '../../components'
import Register2 from './Register2'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['register'],
    title: 'Individual Details - Register',
    component: <AppLayout><Register2/></AppLayout>
  }
}

export default action
