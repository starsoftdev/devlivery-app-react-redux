import React from 'react'
import ContactUs from './ContactUs'
import messages from './messages'
import {AppLayout} from '../../components'
import {setCurrentRouteName} from '../../reducers/global'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['contactUs'],
    title: intl.formatMessage(messages.title),
    breadcrumbs: [
      {name: intl.formatMessage(messages.breadcrumb)},
    ],
    component: <AppLayout><ContactUs intl={intl}/></AppLayout>,
  }
}

export default action
