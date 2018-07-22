import React from 'react'
import {AppLayout} from '../../components'
import GiftStore from './GiftStore'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getGifts} from '../../reducers/gifts'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getGifts())

  return {
    chunks: ['giftStore'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><GiftStore intl={intl}/></AppLayout>,
  }
}

export default action
