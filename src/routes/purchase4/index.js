import React from 'react'
import {AppLayout} from '../../components'
import Purchase4 from './Purchase4'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase4/></AppLayout>
  }
}

export default action
