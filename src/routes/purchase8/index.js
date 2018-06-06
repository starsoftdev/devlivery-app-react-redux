import React from 'react'
import {AppLayout} from '../../components'
import Purchase8 from './Purchase8'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout header={null}><Purchase8/></AppLayout>
  }
}

export default action
