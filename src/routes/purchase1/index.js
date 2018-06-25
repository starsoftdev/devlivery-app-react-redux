import React from 'react'
import {AppLayout} from '../../components'
import Purchase1 from './Purchase1'
import {setCurrentRouteName} from '../../reducers/global'
import {getOccasions} from '../../reducers/purchase'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getOccasions())

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Purchase1 intl={intl}/></AppLayout>
  }
}

export default action
