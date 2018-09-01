import React from 'react'
import Voucher from './Voucher'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    actions: null,
    component: <Voucher intl={intl}/>
  }
}

export default action
