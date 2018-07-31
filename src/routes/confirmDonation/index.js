import React from 'react'
import ConfirmDonation from './ConfirmDonation'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    component: <ConfirmDonation intl={intl}/>
  }
}

export default action
