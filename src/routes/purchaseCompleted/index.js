import React from 'react'
import PurchaseCompleted from './PurchaseCompleted'
import {setCurrentRouteName} from '../../reducers/global'
import {AppLayout} from '../../components'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><PurchaseCompleted intl={intl}/></AppLayout>
  }
}

export default action
