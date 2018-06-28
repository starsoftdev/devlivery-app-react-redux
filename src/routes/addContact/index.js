import React from 'react'
import AddContacts from './AddContact'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({query, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['contacts'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <AddContacts intl={intl}/>,
  }
}

export default action
