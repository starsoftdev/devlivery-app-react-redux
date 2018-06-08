import React from 'react'
import {AppLayout} from '../../components'
import PurchaseCompleted from './PurchaseCompleted'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><PurchaseCompleted/></AppLayout>
  }
}

export default action
