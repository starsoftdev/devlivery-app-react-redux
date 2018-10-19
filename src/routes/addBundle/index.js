import React from 'react'
import AddBundle from './AddBundle'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getBundleDetails} from '../../reducers/purchase';

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getBundleDetails())
  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <AddBundle intl={intl}/>
  }
}

export default action
