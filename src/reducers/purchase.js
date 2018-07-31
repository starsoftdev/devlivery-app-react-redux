import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {message} from 'antd'
import {
  CONFIRM_DONATION_ROUTE,
  DONATION_ROUTE,
  EDIT_BUNDLE_FLOW,
  ORDER_BUNDLE_FLOW, PURCHASE11_ROUTE,
  PURCHASE8_ROUTE,
  PURCHASE_FLOW
} from '../routes'
import {generateUrl} from '../router'
import qs from 'query-string'
import {getToken} from './user'
import {CARD_SIZES, DONATION_TYPE} from '../constants'
import has from 'lodash/has'
import {getFormErrors} from '../utils'

// ------------------------------------
// Constants
// ------------------------------------
export const HANDWRITTEN = 'handwritten'
export const PRINTED = 'printed'

export const ADD_CONTACT_MANUALLY = 'add-contacts-manually'
export const IMPORT_CONTACTS = 'import-contacts'

export const PAYPAL = 'PAYPAL'
export const CREDIT_CARD = 'CREDIT_CARD'

export const SET_BUNDLE = 'Purchase.SET_BUNDLE'
export const SET_FLOW = 'Purchase.SET_FLOW'
export const SET_FLOW_INDEX = 'Purchase.SET_FLOW_INDEX'
export const SET_OCCASION = 'Purchase.SET_OCCASION'
export const SET_LETTERING_TECHNIQUE = 'Purchase.SET_LETTERING_TECHNIQUE'
export const SET_CARD_STYLE = 'Purchase.SET_CARD_STYLE'
export const SET_CARD_SIZE = 'Purchase.SET_CARD_SIZE'
export const SET_CARD = 'Purchase.SET_CARD'
export const SET_CARD_DETAILS = 'Purchase.SET_CARD_DETAILS'
export const SET_GIFT_TYPE = 'Purchase.SET_GIFT_TYPE'
export const CONTINUE_WITHOUT_GIFT = 'Purchase.CONTINUE_WITHOUT_GIFT'
export const SET_GIFT = 'Purchase.SET_GIFT'
export const SET_PAYMENT_METHOD = 'Purchase.SET_PAYMENT_METHOD'

export const GET_OCCASIONS_REQUEST = 'Purchase.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Purchase.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Purchase.GET_OCCASIONS_FAILURE'

export const GET_OCCASION_TYPES_REQUEST = 'Purchase.GET_OCCASION_TYPES_REQUEST'
export const GET_OCCASION_TYPES_SUCCESS = 'Purchase.GET_OCCASION_TYPES_SUCCESS'
export const GET_OCCASION_TYPES_FAILURE = 'Purchase.GET_OCCASION_TYPES_FAILURE'

export const GET_CARD_STYLES_REQUEST = 'Purchase.GET_CARD_STYLES_REQUEST'
export const GET_CARD_STYLES_SUCCESS = 'Purchase.GET_CARD_STYLES_SUCCESS'
export const GET_CARD_STYLES_FAILURE = 'Purchase.GET_CARD_STYLES_FAILURE'

export const GET_CARDS_REQUEST = 'Purchase.GET_CARDS_REQUEST'
export const GET_CARDS_SUCCESS = 'Purchase.GET_CARDS_SUCCESS'
export const GET_CARDS_FAILURE = 'Purchase.GET_CARDS_FAILURE'

export const GET_GIFTS_REQUEST = 'Purchase.GET_GIFTS_REQUEST'
export const GET_GIFTS_SUCCESS = 'Purchase.GET_GIFTS_SUCCESS'
export const GET_GIFTS_FAILURE = 'Purchase.GET_GIFTS_FAILURE'

export const REGISTER_REQUEST = 'Purchase.REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'Purchase.REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'Purchase.REGISTER_FAILURE'

export const ADD_BUNDLE_REQUEST = 'Purchase.ADD_BUNDLE_REQUEST'
export const ADD_BUNDLE_SUCCESS = 'Purchase.ADD_BUNDLE_SUCCESS'
export const ADD_BUNDLE_FAILURE = 'Purchase.ADD_BUNDLE_FAILURE'

export const MAKE_ORDER_REQUEST = 'Purchase.MAKE_ORDER_REQUEST'
export const MAKE_ORDER_SUCCESS = 'Purchase.MAKE_ORDER_SUCCESS'
export const MAKE_ORDER_FAILURE = 'Purchase.MAKE_ORDER_FAILURE'

export const MAKE_STRIPE_PAYMENT_REQUEST = 'Purchase.MAKE_STRIPE_PAYMENT_REQUEST'
export const MAKE_STRIPE_PAYMENT_SUCCESS = 'Purchase.MAKE_STRIPE_PAYMENT_SUCCESS'
export const MAKE_STRIPE_PAYMENT_FAILURE = 'Purchase.MAKE_STRIPE_PAYMENT_FAILURE'

export const MAKE_PAYPAL_PAYMENT_REQUEST = 'Purchase.MAKE_PAYPAL_PAYMENT_REQUEST'
export const MAKE_PAYPAL_PAYMENT_SUCCESS = 'Purchase.MAKE_PAYPAL_PAYMENT_SUCCESS'
export const MAKE_PAYPAL_PAYMENT_FAILURE = 'Purchase.MAKE_PAYPAL_PAYMENT_FAILURE'

export const GET_DONATION_ORGS_REQUEST = 'Purchase.GET_DONATION_ORGS_REQUEST'
export const GET_DONATION_ORGS_SUCCESS = 'Purchase.GET_DONATION_ORGS_SUCCESS'
export const GET_DONATION_ORGS_FAILURE = 'Purchase.GET_DONATION_ORGS_FAILURE'

export const SET_DONATION_ORG = 'Purchase.SET_DONATION_ORG'

export const CONFIRM_DONATION_REQUEST = 'Purchase.CONFIRM_DONATION_REQUEST'
export const CONFIRM_DONATION_SUCCESS = 'Purchase.CONFIRM_DONATION_SUCCESS'
export const CONFIRM_DONATION_FAILURE = 'Purchase.CONFIRM_DONATION_FAILURE'

export const SUBMIT_DONATION = 'Purchase.SUBMIT_DONATION'

export const CLEAR = 'Purchase.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const setFlow = (flow, redirect = true) => (dispatch, getState, {history}) => {
  dispatch({type: SET_FLOW, flow})
  if (redirect) {
    // TODO decide if flow key should be in url to fix issue when user goes back to purchase flow
    // TODO or replace history after finishing flow to prevent this situation
    history.push(generateUrl(flow.routes[0]))
  }
}

export const setBundle = (bundle) => (dispatch, getState) => {
  dispatch({
    type: SET_BUNDLE,
    bundle,
    letteringTechnique: bundle.lettering,
    card: bundle.bundle_card.card,
    gift: bundle.bundle_gifts[0] && bundle.bundle_gifts[0].gift,
    giftType: bundle.bundle_gifts[0] && bundle.bundle_gifts[0].gift.type,
    cardSize: CARD_SIZES().find(item => item.key === bundle.bundle_card.card.size),
    cardStyle: bundle.bundle_card.card.style,
  })
  dispatch(setFlow(ORDER_BUNDLE_FLOW))
}

export const setFlowIndex = () => (dispatch, getState) => {
  const {currentRouteName} = getState().global
  const {flow} = getState().purchase
  const flowIndex = flow.routes.findIndex(item => item === currentRouteName)
  dispatch({type: SET_FLOW_INDEX, flowIndex})
}

// 'step' allows to skip number of steps
export const nextFlowStep = (step = 0) => (dispatch, getState, {history}) => {
  const {flow, flowIndex} = getState().purchase
  history.push(generateUrl(flow.routes[flowIndex + 1 + step]))
  // if step is last (except Thank You page/etc)
  if (flowIndex === flow.routes.length - 2) {
    dispatch(clear())
  }
}

export const setOccasion = (occasion) => ({type: SET_OCCASION, occasion})

export const getOccasions = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASIONS_REQUEST, params})
  const {occasionType} = getState().purchase
  return fetch(`/occasions?${qs.stringify({
    take: 100,
    ...occasionType ? {
      filter_key: 'type',
      filter_value: occasionType,
    } : {},
  })}`, {
    method: 'GET',
    success: (res) => {
      dispatch({type: GET_OCCASIONS_SUCCESS, occasions: res.data})
    },
    failure: () => {
      dispatch({type: GET_OCCASIONS_FAILURE})
    }
  })
}

export const getOccasionTypes = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASION_TYPES_REQUEST})
  return fetch(`/occasion-types`, {
    method: 'GET',
    success: (res) => dispatch({type: GET_OCCASION_TYPES_SUCCESS, occasionTypes: res.data}),
    failure: () => {
      dispatch({type: GET_OCCASION_TYPES_FAILURE})
    }
  })
}

export const setLetteringTechnique = (letteringTechnique) => ({type: SET_LETTERING_TECHNIQUE, letteringTechnique})

export const getCardStyles = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CARD_STYLES_REQUEST})
  return fetch(`/card-styles`, {
    method: 'GET',
    success: (res) => dispatch({type: GET_CARD_STYLES_SUCCESS, cardStyles: res.data}),
    failure: () => dispatch({type: GET_CARD_STYLES_FAILURE})
  })
}

export const setCardStyle = (cardStyle) => ({type: SET_CARD_STYLE, cardStyle})

export const getCards = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CARDS_REQUEST})
  const {occasion, cardStyle} = getState().purchase
  return fetch(`/cards?${qs.stringify({
    take: 100,
    filters: JSON.stringify({
      ...occasion ? {
        occasion_id: occasion,
      } : {},
      ...cardStyle ? {
        style: cardStyle,
      } : {},
    })
  })}`, {
    method: 'GET',
    success: (res) => dispatch({type: GET_CARDS_SUCCESS, cards: res.data}),
    failure: () => dispatch({type: GET_CARDS_FAILURE})
  })
}

export const setCardSize = (cardSize) => ({type: SET_CARD_SIZE, cardSize})

export const submitCardDetails = (cardDetails) => (dispatch, getState) => {
  dispatch(nextFlowStep())
  dispatch({type: SET_CARD_DETAILS, cardDetails})
}

export const setGiftType = (giftType) => ({type: SET_GIFT_TYPE, giftType})

export const setCard = (card) => ({type: SET_CARD, card})

export const setGift = (gift) => ({type: SET_GIFT, gift})

export const getGifts = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_GIFTS_REQUEST, params})
  const {giftType} = getState().purchase
  return fetch(`/gifts?${qs.stringify({
    take: 100,
    ...giftType ? {
      filter_key: 'type',
      filter_value: giftType,
    } : {},
  })}`, {
    method: 'GET',
    success: (res) => {
      dispatch({type: GET_GIFTS_SUCCESS, gifts: res.data})
    },
    failure: () => {
      dispatch({type: GET_GIFTS_FAILURE})
    }
  })
}

export const submitShipping = () => (dispatch, getState) => {
  dispatch(nextFlowStep())
}

export const setPaymentMethod = (paymentMethod) => ({type: SET_PAYMENT_METHOD, paymentMethod})

export const register = (values, form) => (dispatch, getState, {fetch}) => {
  dispatch({type: REGISTER_REQUEST})
  return fetch(`/signup`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: values,
    success: (res) => {
      dispatch({type: REGISTER_SUCCESS})
      dispatch(loginSuccess(res.data))
      dispatch(nextFlowStep())
    },
    failure: (res) => {
      const {formErrors} = getFormErrors({...res, values})
      if (formErrors)
        form.setFields(formErrors)
      else
      // TODO
        message.error('Something went wrong. Please try again.')
      dispatch({type: REGISTER_FAILURE})
    },
  })
}

export const continueWithoutGift = () => async (dispatch, getState) => {
  const {loggedIn} = getState().user
  const {flow} = getState().purchase
  dispatch(setGiftType(null))
  // TODO fix it
  if (loggedIn && flow.key !== EDIT_BUNDLE_FLOW.key) {
    await dispatch(addBundle())
  }
  dispatch(nextFlowStep(1))
}

export const submitGift = () => async (dispatch, getState) => {
  const {flow} = getState().purchase
  // TODO fix it
  if (flow.key !== EDIT_BUNDLE_FLOW.key) {
    await dispatch(addBundle())
  }
  dispatch(nextFlowStep())
}

// TODO backend can't get undefined value
export const getBundleValues = (values) => {
  return Object.keys(values).forEach(key => values[key] === undefined && delete values[key])
}

export const addBundle = (values = {}) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {letteringTechnique, card, gift, flow} = getState().purchase
  dispatch({type: ADD_BUNDLE_REQUEST})
  return fetch(`/create-bundle`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      lettering: letteringTechnique,
      card_id: card && card.id,
      ...gift ? {
        gift_id: gift.id,
      } : {},
      // TODO send html here
      body: '.',
      ...getBundleValues(values),
    },
    token,
    success: (res) => {
      dispatch({type: ADD_BUNDLE_SUCCESS, bundle: res.data})
      if (flow.key === EDIT_BUNDLE_FLOW.key) {
        dispatch(nextFlowStep())
        message.success('Bundle created.')
      }
    },
    failure: () => {
      dispatch({type: ADD_BUNDLE_FAILURE})
    },
  })
}

export const makeOrder = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {bundle, order} = getState().purchase
  if (!bundle || order) {
    return
  }
  dispatch({type: MAKE_ORDER_REQUEST})
  return fetch(`/make-order-from-bundle`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      bundle_id: bundle.id,
    },
    token,
    success: (res) => {
      dispatch({type: MAKE_ORDER_SUCCESS, order: res.data})
    },
    failure: () => {
      dispatch({type: MAKE_ORDER_FAILURE})
    },
  })
}

export const makeStripePayment = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {order} = getState().purchase
  if (!order) {
    return
  }
  dispatch({type: MAKE_STRIPE_PAYMENT_REQUEST})
  return fetch(`/payments/stripe/charge/${order.id}`, {
    method: 'POST',
    body: {
      stripeToken: '',
    },
    token,
    success: (res) => {
      dispatch({type: MAKE_STRIPE_PAYMENT_SUCCESS})
    },
    failure: () => {
      dispatch({type: MAKE_STRIPE_PAYMENT_FAILURE})
    },
  })
}

export const makePaypalPayment = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {order} = getState().purchase
  if (!order) {
    return
  }
  dispatch({type: MAKE_PAYPAL_PAYMENT_REQUEST})
  return fetch(`/payments/paypal/charge/${order.id}`, {
    method: 'POST',
    token,
    success: (res) => {
      dispatch({type: MAKE_PAYPAL_PAYMENT_SUCCESS})
    },
    failure: () => {
      dispatch({type: MAKE_PAYPAL_PAYMENT_FAILURE})
    },
  })
}

export const getDonationOrgs = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: GET_DONATION_ORGS_REQUEST})
  return fetch(`/donation`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_DONATION_ORGS_SUCCESS, donationOrgs: res.data}),
    failure: () => dispatch({type: GET_DONATION_ORGS_FAILURE})
  })
}

export const setDonationOrg = (donationOrg) => ({type: SET_DONATION_ORG, donationOrg})

export const submitGiftType = () => (dispatch, getState) => {
  const {flow, giftType} = getState().purchase
  if (giftType === DONATION_TYPE) {
    dispatch(setFlow({
      ...flow,
      routes: flow.routes.map(item => {
        if (item === PURCHASE8_ROUTE)
          return DONATION_ROUTE
        if (item === PURCHASE11_ROUTE)
          return CONFIRM_DONATION_ROUTE
        return item
      })
    }, false))
  } else {
    dispatch(setFlow({
      ...flow,
      routes: flow.routes.map(item => {
        if (item === DONATION_ROUTE)
          return PURCHASE8_ROUTE
        if (item === CONFIRM_DONATION_ROUTE)
          return PURCHASE11_ROUTE
        return item
      })
    }, false))
  }
  dispatch(nextFlowStep())
}

export const submitDonation = ({donationAmount}) => (dispatch, getState) => {
  dispatch({type: SUBMIT_DONATION, donationAmount})
  dispatch(submitGift())
}

export const confirmDonation = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {donationOrg, bundle, donationAmount} = getState().purchase
  dispatch({type: CONFIRM_DONATION_REQUEST})
  return fetch(`/donations`, {
    method: 'POST',
    body: {
      bundle_id: bundle.id,
      organization_id: donationOrg.id,
      amount: +donationAmount,
    },
    token,
    success: (res) => {
      // TODO save data for next steps
      dispatch({type: CONFIRM_DONATION_SUCCESS})
      dispatch(nextFlowStep())
    },
    failure: () => {
      dispatch({type: CONFIRM_DONATION_FAILURE})
    },
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    occasions: false,
    donationOrgs: false,
    cards: false,
  },
  occasions: [],
  occasion: null,
  letteringTechnique: null,
  cardStyle: null,
  cardSize: null,
  cardDetails: null,
  giftType: undefined,
  card: null,
  gift: null,
  gifts: [],
  paymentMethod: null,
  cardStyles: [],
  cards: [],
  flow: PURCHASE_FLOW,
  flowIndex: null,
  occasionTypes: [],
  occasionType: undefined,
  bundle: null,
  order: null,
  donationOrgs: [],
  donationOrg: null,
  donationAmount: undefined,
}

export default createReducer(initialState, {
  [SET_BUNDLE]: (state, {bundle, letteringTechnique, card, gift, giftType, cardSize, cardStyle}) => ({
    bundle,
    letteringTechnique,
    card,
    gift,
    giftType,
    cardSize,
    cardStyle,
  }),
  [SET_FLOW]: (state, {flow}) => ({
    flow,
  }),
  [SET_FLOW_INDEX]: (state, {flowIndex}) => ({
    flowIndex,
  }),
  [SET_OCCASION]: (state, {occasion}) => ({
    occasion,
  }),
  [GET_OCCASIONS_REQUEST]: (state, {params}) => ({
    occasionType: params.occasionType,
    loading: {
      ...state.loading,
      occasions: true,
    }
  }),
  [GET_OCCASIONS_SUCCESS]: (state, {occasions}) => ({
    occasions,
    loading: {
      ...state.loading,
      occasions: false,
    }
  }),
  [GET_OCCASIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      occasions: false,
    }
  }),
  [GET_OCCASION_TYPES_SUCCESS]: (state, {occasionTypes}) => ({
    occasionTypes,
  }),
  [SET_LETTERING_TECHNIQUE]: (state, {letteringTechnique}) => ({
    letteringTechnique,
  }),
  [GET_CARD_STYLES_SUCCESS]: (state, {cardStyles}) => ({
    cardStyles,
  }),
  [SET_CARD_STYLE]: (state, {cardStyle}) => ({
    cardStyle,
  }),
  [GET_CARDS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      cards: true,
    }
  }),
  [GET_CARDS_SUCCESS]: (state, {cards}) => ({
    cards,
    loading: {
      ...state.loading,
      cards: false,
    }
  }),
  [GET_CARDS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      cards: false,
    }
  }),
  [SET_CARD_SIZE]: (state, {cardSize}) => ({
    cardSize,
  }),
  [SET_CARD]: (state, {card}) => ({
    card,
  }),
  [SET_CARD_DETAILS]: (state, {cardDetails}) => ({
    cardDetails,
  }),
  [SET_GIFT_TYPE]: (state, {giftType}) => ({
    giftType,
  }),
  [CONTINUE_WITHOUT_GIFT]: (state, action) => ({
    giftType: null,
  }),
  [SET_GIFT]: (state, {gift}) => ({
    gift,
  }),
  [GET_GIFTS_REQUEST]: (state, {params}) => ({
    giftType: has(params, 'giftType') ? params.giftType : state.giftType,
  }),
  [GET_GIFTS_SUCCESS]: (state, {gifts}) => ({
    gifts,
  }),
  [SET_PAYMENT_METHOD]: (state, {paymentMethod}) => ({
    paymentMethod,
  }),
  [ADD_BUNDLE_SUCCESS]: (state, {bundle}) => ({
    bundle,
  }),
  [MAKE_ORDER_SUCCESS]: (state, {order}) => ({
    order,
  }),
  [SET_DONATION_ORG]: (state, {donationOrg}) => ({
    donationOrg,
  }),
  [GET_DONATION_ORGS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      donationOrgs: true,
    }
  }),
  [GET_DONATION_ORGS_SUCCESS]: (state, {donationOrgs}) => ({
    donationOrgs,
    loading: {
      ...state.loading,
      donationOrgs: false,
    }
  }),
  [GET_DONATION_ORGS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      donationOrgs: false,
    }
  }),
  [SUBMIT_DONATION]: (state, {donationAmount}) => ({
    donationAmount,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
