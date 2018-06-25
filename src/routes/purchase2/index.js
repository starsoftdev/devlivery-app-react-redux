import React from 'react'
import {AppLayout} from '../../components'
import Purchase2 from './Purchase2'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Purchase2 intl={intl}/></AppLayout>
  }
}

export default action
