import React from 'react'
import {AppLayout} from '../../components'
import Purchase3 from './Purchase3'
import {setCurrentRouteName} from '../../reducers/global'
import {getCardStyles} from '../../reducers/purchase'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getCardStyles())

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase3/></AppLayout>
  }
}

export default action
