import React from 'react'
import {AppLayout} from '../../components'
import Register4 from './Register4'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getUserCreatedRoles} from '../../reducers/permissions'

function action({params,store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getUserCreatedRoles())
  
  return {
    chunks: ['register'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><Register4 intl={intl} fromdashboard={params.fromdashboard}/></AppLayout>
  }
}

export default action
