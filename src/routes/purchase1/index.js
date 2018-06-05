import React from 'react'
import {AppLayout} from '../../components'
import Purchase1 from './Purchase1'
import {setCurrentRouteName} from '../../reducers/global'
import {getOccasions} from '../../reducers/purchase'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOccasions())

  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <AppLayout><Purchase1/></AppLayout>
  }
}

export default action
