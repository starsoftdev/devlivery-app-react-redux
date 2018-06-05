import React from 'react'
import {AppLayout} from '../../components'
import Purchase3 from './Purchase3'
import {setCurrentRouteName} from '../../reducers/global'
import {getOccasions} from '../../reducers/purchase'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOccasions())

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase3/></AppLayout>
  }
}

export default action
