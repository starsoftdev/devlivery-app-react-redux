import React from 'react'
import Bundles from './Bundles'
import {setCurrentRouteName} from '../../reducers/global'
import {getBundles} from '../../reducers/bundles'

function action({query, store, route}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getBundles())

  return {
    chunks: ['dashboard'],
    title: 'Bundles',
    component: <Bundles/>,
  }
}

export default action
