import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {message} from 'antd'
import {PURCHASE_COMPLETED_ROUTE, PURCHASE_ROUTES} from '../routes'
import {generateUrl} from '../router'
import qs from 'query-string'
import {getToken} from './user'

// ------------------------------------
// Constants
// ------------------------------------
export const HANDWRITTEN = 'handwritten'
export const PRINTED = 'printed'

export const ADD_CONTACT_MANUALLY = 'add-contacts-manually'
export const IMPORT_CONTACTS = 'import-contacts'

export const PAYPAL = 'PAYPAL'
export const CREDIT_CARD = 'CREDIT_CARD'

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

export const GET_ORDER_DETAILS_REQUEST = 'Purchase.GET_ORDER_DETAILS_REQUEST'
export const GET_ORDER_DETAILS_SUCCESS = 'Purchase.GET_ORDER_DETAILS_SUCCESS'
export const GET_ORDER_DETAILS_FAILURE = 'Purchase.GET_ORDER_DETAILS_FAILURE'

export const MAKE_STRIPE_PAYMENT_REQUEST = 'Purchase.MAKE_STRIPE_PAYMENT_REQUEST'
export const MAKE_STRIPE_PAYMENT_SUCCESS = 'Purchase.MAKE_STRIPE_PAYMENT_SUCCESS'
export const MAKE_STRIPE_PAYMENT_FAILURE = 'Purchase.MAKE_STRIPE_PAYMENT_FAILURE'

export const MAKE_PAYPAL_PAYMENT_REQUEST = 'Purchase.MAKE_PAYPAL_PAYMENT_REQUEST'
export const MAKE_PAYPAL_PAYMENT_SUCCESS = 'Purchase.MAKE_PAYPAL_PAYMENT_SUCCESS'
export const MAKE_PAYPAL_PAYMENT_FAILURE = 'Purchase.MAKE_PAYPAL_PAYMENT_FAILURE'

export const CLEAR = 'Purchase.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const setFlow = (flow) => ({type: SET_FLOW, flow})

export const setFlowIndex = () => (dispatch, getState) => {
  const {currentRouteName} = getState().global
  const {flow} = getState().purchase
  const flowIndex = flow.findIndex(item => item === currentRouteName)
  dispatch({type: SET_FLOW_INDEX, flowIndex})
}

// 'step' allows to skip number of steps
export const nextFlowStep = (step = 0) => (dispatch, getState, {history}) => {
  const {flow, flowIndex} = getState().purchase
  if (flowIndex === flow.length - 1) {
    history.push(generateUrl(PURCHASE_COMPLETED_ROUTE))
  } else {
    history.push(generateUrl(flow[flowIndex + 1 + step]))
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
    success: (res) =>  dispatch({type: GET_OCCASION_TYPES_SUCCESS, occasionTypes: res.data}),
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
  return fetch(`/cards`, {
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
  return fetch(`/gifts?${qs.stringify({
    take: 100,
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

export const register = (values) => (dispatch, getState, {fetch}) => {
  dispatch({type: REGISTER_REQUEST})
  return fetch(`/signup`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: values,
    success: (res) => {
      dispatch({type: REGISTER_SUCCESS})
      dispatch(loginSuccess(res.data))
      dispatch(submitGift())
    },
    failure: () => {
      dispatch({type: REGISTER_FAILURE})
      message.error('Something went wrong. Please try again.')
    },
  })
}

export const continueWithoutGift = () => (dispatch, getState) => {
  const {loggedIn} = getState().user
  dispatch(setGiftType(null))
  if (loggedIn) {
    dispatch(addBundle())
  }
  dispatch(nextFlowStep(1))
}

export const submitGift = () => (dispatch, getState) => {
  const {loggedIn} = getState().user
  if (loggedIn) {
    dispatch(addBundle())
  }
  dispatch(nextFlowStep())
}

export const addBundle = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {letteringTechnique, card, gift, cardSize} = getState().purchase
  dispatch({type: ADD_BUNDLE_REQUEST})
  return fetch(`/create-bundle`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      lettering: letteringTechnique,
      card_id: card && card.id,
      gift_id: gift && gift.id,
      card_format: cardSize,
      // TODO send html here
      body: '1',
      // TODO remove these fields
      font_weight: '1',
      font: '1',
      font_color: '1',
      font_size: '1',
      gift_quantity: '1',
      title: '111',
    },
    token,
    success: (res) => {
      dispatch({type: ADD_BUNDLE_SUCCESS, bundle: res.data})
      dispatch(makeOrder())
    },
    failure: () => {
      dispatch({type: ADD_BUNDLE_FAILURE})
    },
  })
}

export const makeOrder = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {bundle} = getState().purchase
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

export const getOrderDetails = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {order} = getState().purchase
  if (!order) {
    return
  }
  dispatch({type: GET_ORDER_DETAILS_REQUEST})
  return fetch(`/order-confirmation?${qs.stringify({
    order_id: order.id,
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_ORDER_DETAILS_SUCCESS, orderDetails: res.data})
    },
    failure: () => {
      dispatch({type: GET_ORDER_DETAILS_FAILURE})
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
      console.log(res)
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
      console.log(res)
      dispatch({type: MAKE_PAYPAL_PAYMENT_SUCCESS})
    },
    failure: () => {
      dispatch({type: MAKE_PAYPAL_PAYMENT_FAILURE})
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
  },
  occasions: [],
  occasion: null,
  letteringTechnique: null,
  cardStyle: null,
  cardSize: null,
  cardDetails: null,
  giftType: null,
  card: null,
  gift: null,
  gifts: [],
  paymentMethod: null,
  cardStyles: [],
  cards: [],
  flow: PURCHASE_ROUTES,
  flowIndex: null,
  occasionTypes: [],
  occasionType: undefined,
  bundle: null,
  order: null,
  orderDetails: null,
}

export default createReducer(initialState, {
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
  [GET_CARDS_SUCCESS]: (state, {cards}) => ({
    cards,
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
  [GET_ORDER_DETAILS_SUCCESS]: (state, {orderDetails}) => ({
    orderDetails,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
