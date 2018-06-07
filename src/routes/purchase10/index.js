import React from 'react'
import {AppLayout} from '../../components'
import Purchase10 from './Purchase10'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase10/></AppLayout>
  }
}

export default action
