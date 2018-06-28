import React from 'react'
import ContactGroups from './ContactGroups'
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
    component: <ContactGroups intl={intl}/>,
  }
}

export default action
