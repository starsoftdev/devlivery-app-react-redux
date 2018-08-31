import React from 'react'
import EditContact from './EditContact'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getContact} from '../../reducers/contacts'

function action({params, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  if(store.getState().global.nextPathname == null)
    store.dispatch(getContact(params.contactId))

  return {
    chunks: ['contacts'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <EditContact intl={intl}/>,
  }
}

export default action
