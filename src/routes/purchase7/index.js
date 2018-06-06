import React from 'react'
import {AppLayout} from '../../components'
import Purchase7 from './Purchase7'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase7/></AppLayout>
  }
}

export default action
