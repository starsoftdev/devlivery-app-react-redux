import React from 'react'
import Purchase8 from './Purchase8'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    header: null,
    component: <Purchase8 intl={intl}/>
  }
}

export default action
