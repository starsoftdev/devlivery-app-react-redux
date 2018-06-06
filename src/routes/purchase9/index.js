import React from 'react'
import {AppLayout} from '../../components'
import Purchase9 from './Purchase9'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase9/></AppLayout>
  }
}

export default action
