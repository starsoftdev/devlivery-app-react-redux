import React from 'react'
import {AppLayout} from '../../components'
import ResetPassword from './ResetPassword'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['resetPassword'],
    title: 'Reset Password',
    component: <AppLayout><ResetPassword/></AppLayout>,
  }
}

export default action
