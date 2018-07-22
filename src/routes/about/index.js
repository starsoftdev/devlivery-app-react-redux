import React from 'react'
import {AppLayout} from '../../components'
import About from './About'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['about'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><About intl={intl}/></AppLayout>,
  }
}

export default action
