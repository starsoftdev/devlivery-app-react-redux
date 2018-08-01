import React from 'react'
import ContactGroup from './ContactGroup'
import {setCurrentRouteName} from '../../reducers/global'
import {getContacts, getGroupContacts} from '../../reducers/contactGroup'
import messages from './messages'

function action({store, route, intl, query, params}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getContacts())
  if (params.groupId) {
    store.dispatch(getGroupContacts({...params, ...query}))
  }

  return {
    chunks: ['contacts'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <ContactGroup intl={intl}/>,
  }
}

export default action
