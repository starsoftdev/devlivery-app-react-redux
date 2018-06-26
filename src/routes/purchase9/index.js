import React from 'react'
import Purchase9 from './Purchase9'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <Purchase9 intl={intl}/>
  }
}

export default action
