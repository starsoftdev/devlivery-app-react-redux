import React from 'react'
import PurchaseCompleted from './PurchaseCompleted'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <PurchaseCompleted/>
  }
}

export default action
