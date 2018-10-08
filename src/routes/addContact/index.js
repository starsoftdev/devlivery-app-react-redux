import React from 'react'
import AddContact from './AddContact'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {setupBirthday} from '../../reducers/contacts'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(setupBirthday(false));
  
  return {
    chunks: ['contacts'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <AddContact intl={intl}/>,
  }
}

export default action
