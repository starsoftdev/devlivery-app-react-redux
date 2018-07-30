import React from 'react'
import PaypalRedirectBack from './PaypalRedirectBack'
import {setCurrentRouteName} from '../../reducers/global'
import {PAYPAL_REDIRECT_BACK_CANCEL} from '../../routes'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'PayPal Redirect',
    component: <PaypalRedirectBack cancel={route.name === PAYPAL_REDIRECT_BACK_CANCEL} intl={intl}/>
  }
}

export default action
