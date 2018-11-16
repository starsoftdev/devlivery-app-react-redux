import React from 'react'
import User from './User'
import {setCurrentRouteName} from '../../reducers/global'
import {getUserDetails,getAllCards} from '../../reducers/user'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  if(store.getState().global.nextPathname == null)
  {
    store.dispatch(getUserDetails())
    store.dispatch(getAllCards())
  }
  return {
    chunks: ['dashboard'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <User intl={intl}/>,
  }
}

export default action
