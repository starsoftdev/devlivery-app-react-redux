import React from 'react'
import Purchase10 from './Purchase10'
import {setCurrentRouteName} from '../../reducers/global'
import {getContacts} from '../../reducers/contacts'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getContacts())
  return {
    chunks: ['purchase'],
    title: 'Purchase',
    component: <Purchase10 intl={intl}/>,
    actions: null
  }
}

export default action
