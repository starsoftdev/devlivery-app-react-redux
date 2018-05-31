import React from 'react'
import {AppLayout} from '../../components'
import Home from './Home'
import {setCurrentRouteName} from '../../reducers/global'

async function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['home'],
    title: 'ByZumi',
    component: <AppLayout><Home/></AppLayout>,
  }
}

export default action
