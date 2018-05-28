import React from 'react'
import {AppLayout} from '../../components'
import SetPassword from './SetPassword'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route, query}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['setPassword'],
    title: 'Set Password',
    component: <AppLayout><SetPassword params={query}/></AppLayout>,
  }
}

export default action
