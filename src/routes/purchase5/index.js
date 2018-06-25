import React from 'react'
import {AppLayout} from '../../components'
import Purchase5 from './Purchase5'
import {setCurrentRouteName} from '../../reducers/global'
import {getCards} from '../../reducers/purchase'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getCards())

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout header={null}><Purchase5 intl={intl}/></AppLayout>
  }
}

export default action
