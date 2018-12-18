import React from 'react'
import {AppLayout} from '../../components'
import Privacy from './Privacy'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['terms'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Privacy intl={intl}/></AppLayout>,
  }
}

export default action
