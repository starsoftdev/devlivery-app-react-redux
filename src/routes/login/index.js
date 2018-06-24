import React from 'react'
import {AppLayout} from '../../components'
import Login from './Login'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({query, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['login'],
    title: intl.formatMessage(messages.title),
    component: (
      <AppLayout>
        <Login redirectUrl={query.next} intl={intl}/>
      </AppLayout>
    ),
  }
}

export default action
