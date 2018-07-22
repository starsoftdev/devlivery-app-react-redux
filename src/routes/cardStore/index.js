import React from 'react'
import {AppLayout} from '../../components'
import CardStore from './CardStore'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getCards, getCardStyles, getOccasions, getOccasionTypes} from '../../reducers/cards'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getCards())
  store.dispatch(getCardStyles())
  store.dispatch(getOccasionTypes())
  store.dispatch(getOccasions())

  return {
    chunks: ['cardStore'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><CardStore intl={intl}/></AppLayout>,
  }
}

export default action
