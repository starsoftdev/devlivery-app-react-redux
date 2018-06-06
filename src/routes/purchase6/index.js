import React from 'react'
import {AppLayout} from '../../components'
import Purchase6 from './Purchase6'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout header={null}><Purchase6/></AppLayout>
  }
}

export default action
