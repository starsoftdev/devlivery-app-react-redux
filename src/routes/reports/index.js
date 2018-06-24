import React from 'react'
import Reports from './Reports'
import {setCurrentRouteName} from '../../reducers/global'
import {getOccasions, getReports} from '../../reducers/reports'
import {BASE_DASHBOARD_BREADCRUMBS} from '../'
import messages from './messages'

function action({query, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getReports())
  store.dispatch(getOccasions())

  return {
    chunks: ['dashboard'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      ...BASE_DASHBOARD_BREADCRUMBS,
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <Reports intl={intl}/>,
  }
}

export default action
