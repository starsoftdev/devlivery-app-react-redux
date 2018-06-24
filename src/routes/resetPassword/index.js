import React from 'react'
import {AppLayout} from '../../components'
import ResetPassword from './ResetPassword'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['resetPassword'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><ResetPassword intl={intl}/></AppLayout>,
  }
}

export default action
