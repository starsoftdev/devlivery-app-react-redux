import React from 'react'
import {AppLayout} from '../../components'
import Purchase11 from './Purchase11'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase11/></AppLayout>
  }
}

export default action
