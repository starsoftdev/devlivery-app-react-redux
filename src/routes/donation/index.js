import React from 'react'
import Donation from './Donation'
import {setCurrentRouteName} from '../../reducers/global'
import {getDonationOrgs} from '../../reducers/purchase'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getDonationOrgs())

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    actions: null,
    component: <Donation intl={intl}/>
  }
}

export default action
