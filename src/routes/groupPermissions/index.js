import React from 'react'
import GroupPermissions from './GroupPermissions'
import {setCurrentRouteName} from '../../reducers/global'
import {getTeam} from '../../reducers/team'
import messages from './messages'
import {TEAM_ACCOUNT} from '../../reducers/register'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getTeam())

  const {user} = store.getState().user

  if (user.account_type !== TEAM_ACCOUNT) {
    return {redirect: '/'}
  }

  return {
    chunks: ['dashboard'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <GroupPermissions intl={intl}/>,
  }
}

export default action
