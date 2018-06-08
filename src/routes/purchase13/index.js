import React from 'react'
import {AppLayout} from '../../components'
import Purchase13 from './Purchase13'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase13/></AppLayout>
  }
}

export default action
