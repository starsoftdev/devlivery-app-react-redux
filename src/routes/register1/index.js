import React from 'react'
import {AppLayout} from '../../components'
import Register1 from './Register1'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['register'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Register1 intl={intl}/></AppLayout>
  }
}

export default action
