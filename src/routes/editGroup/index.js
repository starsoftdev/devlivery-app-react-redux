import React from 'react'
import EditGroup from './EditGroup'
import {setCurrentRouteName} from '../../reducers/global'
import {getGroupContacts} from '../../reducers/contactGroup'
import messages from './messages'

function action({store, route, intl, query, params}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getGroupContacts({...params, ...query}))

  return {
    chunks: ['contacts'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <EditGroup intl={intl}/>,
  }
}

export default action
