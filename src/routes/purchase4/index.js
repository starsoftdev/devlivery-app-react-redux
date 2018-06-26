import React from 'react'
import Purchase4 from './Purchase4'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <Purchase4 intl={intl}/>
  }
}

export default action
