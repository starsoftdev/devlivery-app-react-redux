import React from 'react'
import {AppLayout} from '../../components'
import Purchase2 from './Purchase2'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase2/></AppLayout>
  }
}

export default action
