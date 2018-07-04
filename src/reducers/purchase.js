import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {message} from 'antd'
import {PURCHASE_COMPLETED_ROUTE, PURCHASE_ROUTES} from '../routes'
import {generateUrl} from '../router'
import qs from 'query-string'

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
export const SET_ADDING_CONTACTS_MODE = 'Purchase.SET_ADDING_CONTACTS_MODE'

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

export const nextFlowStep = () => (dispatch, getState, {history}) => {
  const {flow, flowIndex} = getState().purchase
  if (flowIndex === flow.length - 1) {
    history.push(generateUrl(PURCHASE_COMPLETED_ROUTE))
  } else {
    history.push(generateUrl(flow[flowIndex + 1]))
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

export const submitCardSize = () => (dispatch, getState, {history}) => {
  const {cardSize} = getState().purchase
  if (!cardSize) return
  history.push('/purchase/card')
}

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

export const setAddingContactsMode = (addingContactMode) => ({type: SET_ADDING_CONTACTS_MODE, addingContactMode})

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
      dispatch(nextFlowStep())
    },
    failure: () => {
      dispatch({type: REGISTER_FAILURE})
      message.error('Something went wrong. Please try again.')
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
  cardDetails: {},
  giftType: null,
  gift: null,
  gifts: [],
  addingContactMode: null,
  paymentMethod: null,
  cardStyles: [],
  cards: [],
  flow: PURCHASE_ROUTES,
  flowIndex: null,
  occasionTypes: [],
  occasionType: undefined,
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
    occasionType: params.occasionType || state.occasionType,
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
  [SET_ADDING_CONTACTS_MODE]: (state, {addingContactMode}) => ({
    addingContactMode,
  }),
  [SET_PAYMENT_METHOD]: (state, {paymentMethod}) => ({
    paymentMethod,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
