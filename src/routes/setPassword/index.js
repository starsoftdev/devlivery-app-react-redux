import React from 'react'
import {AppLayout} from '../../components'
import SetPassword from './SetPassword'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route, query}) {
  store.dispatch(setCurrentRouteName(route.name))

  if (!query.token) {
    return {redirect: '/'}
  }

  return {
    chunks: ['setPassword'],
    title: 'Set Password',
    component: <AppLayout><SetPassword query={query}/></AppLayout>,
  }
}

export default action
