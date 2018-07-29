import React from 'react'
import AddBundle from './AddBundle'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <AddBundle intl={intl}/>
  }
}

export default action
