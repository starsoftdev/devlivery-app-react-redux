import React from 'react'
import {AppLayout} from '../../components'
import Home from './Home'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['home'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Home intl={intl}/></AppLayout>,
  }
}

export default action
