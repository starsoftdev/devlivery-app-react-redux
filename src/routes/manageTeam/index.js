import React from 'react'
import ManageTeam from './ManageTeam'
import {setCurrentRouteName} from '../../reducers/global'
import {getTeam} from '../../reducers/team'
import {getPendingTeam} from '../../reducers/pendingMembers'
import messages from './messages'
import {TEAM_ACCOUNT} from '../../reducers/register'
import {getUserPermission,hasAnyPermission} from '../../reducers/permissions'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getTeam())
  store.dispatch(getPendingTeam())
  //store.dispatch(hasAnyPermission(["Can pay"]))
  
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
    component: <ManageTeam intl={intl}/>,
  }
}

export default action
