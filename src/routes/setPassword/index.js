import React from 'react'
import {AppLayout} from '../../components'
import SetPassword from './SetPassword'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, query, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  if (!query.token) {
    return {redirect: '/'}
  }

  return {
    chunks: ['setPassword'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><SetPassword query={query} intl={intl}/></AppLayout>,
  }
}

export default action
