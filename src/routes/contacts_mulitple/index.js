import React from 'react'
import Contacts from './Contacts'
import {setCurrentRouteName} from '../../reducers/global'
import {getContactGroups} from '../../reducers/contactGroups'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getContactGroups())

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
