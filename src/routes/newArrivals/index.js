import React from 'react'
import {AppLayout} from '../../components'
import NewArrivals from './NewArrivals'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getCards, getGifts} from '../../reducers/newArrivals'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getCards())
  store.dispatch(getGifts())

  return {
    chunks: ['newArrivals'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><NewArrivals intl={intl}/></AppLayout>,
  }
}

export default action
