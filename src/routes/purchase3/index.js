import React from 'react'
import {AppLayout} from '../../components'
import Purchase3 from './Purchase3'
import {setCurrentRouteName} from '../../reducers/global'
import {getCardStyles} from '../../reducers/purchase'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getCardStyles())

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Purchase3 intl={intl}/></AppLayout>
  }
}

export default action
