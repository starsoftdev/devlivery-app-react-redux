import React from 'react'
import Contacts from './Contacts'
import {setCurrentRouteName} from '../../reducers/global'
import {getContacts} from '../../reducers/contacts'
import messages from './messages'

function action({query, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getContacts())

  return {
    chunks: ['contacts'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <Contacts intl={intl}/>,
  }
}

export default action
