import React from 'react'
import {AppLayout} from '../../components'
import Register3 from './Register3'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['register'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Register3 intl={intl}/></AppLayout>
  }
}

export default action
