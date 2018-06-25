import React from 'react'
import {AppLayout} from '../../components'
import Purchase6 from './Purchase6'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout header={null}><Purchase6 intl={intl}/></AppLayout>
  }
}

export default action
