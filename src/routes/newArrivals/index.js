import React from 'react'
import {AppLayout} from '../../components'
import NewArrivals from './NewArrivals'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'
import {getCards, getGifts} from '../../reducers/newArrivals'
import {CARD_IMAGES_PROP, DEFAULT_DEBOUNCE_TIME, FOOD_TYPE, GIFT_IMAGES_PROP, NON_FOOD_TYPE} from '../../constants'
import {getOccasions} from '../../reducers/cards'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(getGifts({giftType: FOOD_TYPE}))
  store.dispatch(getGifts({giftType: NON_FOOD_TYPE}))
  store.dispatch(getCards())
  store.dispatch(getOccasions())

  return {
    chunks: ['newArrivals'],
    title: intl.formatMessage(messages.title),
    component: <AppLayout><NewArrivals intl={intl}/></AppLayout>,
  }
}

export default action
