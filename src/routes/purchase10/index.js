import React from 'react'
import Purchase10 from './Purchase10'
import {setCurrentRouteName} from '../../reducers/global'
import {getContactGroups} from '../../reducers/contactGroups'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getContactGroups())
  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <Purchase10 intl={intl}/>,
    actions: null
  }
}

export default action
