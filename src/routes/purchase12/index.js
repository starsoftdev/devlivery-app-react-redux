import React from 'react'
import {AppLayout} from '../../components'
import Purchase12 from './Purchase12'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase12/></AppLayout>
  }
}

export default action
