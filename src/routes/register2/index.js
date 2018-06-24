import React from 'react'
import {AppLayout} from '../../components'
import Register2 from './Register2'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['register'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Register2 intl={intl}/></AppLayout>
  }
}

export default action
