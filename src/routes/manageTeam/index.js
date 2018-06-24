import React from 'react'
import ManageTeam from './ManageTeam'
import {setCurrentRouteName} from '../../reducers/global'
import {getTeam} from '../../reducers/team'
import messages from './messages'

function action({query, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getTeam())

  return {
    chunks: ['dashboard'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <ManageTeam intl={intl}/>,
  }
}

export default action
