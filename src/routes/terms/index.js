import React from 'react'
import {AppLayout} from '../../components'
import Terms from './Terms'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['terms'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Terms intl={intl}/></AppLayout>,
  }
}

export default action
