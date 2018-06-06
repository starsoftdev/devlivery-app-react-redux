import React from 'react'
import {AppLayout} from '../../components'
import Purchase5 from './Purchase5'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout header={null}><Purchase5/></AppLayout>
  }
}

export default action
