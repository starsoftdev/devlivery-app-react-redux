import React from 'react'
import Bundles from './Bundles'
import {setCurrentRouteName} from '../../reducers/global'
import {getBundles} from '../../reducers/bundles'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getBundles())

  return {
    chunks: ['dashboard'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <Bundles intl={intl}/>,
  }
}

export default action
