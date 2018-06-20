import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {message} from 'antd'

// ------------------------------------
// Constants
// ------------------------------------
export const HANDWRITTEN = 'handwritten'
export const PRINTED = 'printed'

export const ADD_CONTACTS_MANUALLY = 'add-contacts-manually'
export const IMPORT_CONTACTS = 'import-contacts'

export const SET_OCCASION = 'Purchase.SET_OCCASION'

export const GET_OCCASIONS_REQUEST = 'Purchase.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Purchase.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Purchase.GET_OCCASIONS_FAILURE'

export const SET_LETTERING_TECHNIQUE = 'Purchase.SET_LETTERING_TECHNIQUE'

export const SET_CARD_STYLE = 'Purchase.SET_CARD_STYLE'

export const GET_CARD_STYLES_REQUEST = 'Purchase.GET_CARD_STYLES_REQUEST'
export const GET_CARD_STYLES_SUCCESS = 'Purchase.GET_CARD_STYLES_SUCCESS'
export const GET_CARD_STYLES_FAILURE = 'Purchase.GET_CARD_STYLES_FAILURE'

export const SET_CARD_SIZE = 'Purchase.SET_CARD_SIZE'

export const GET_CARDS_REQUEST = 'Purchase.GET_CARDS_REQUEST'
export const GET_CARDS_SUCCESS = 'Purchase.GET_CARDS_SUCCESS'
export const GET_CARDS_FAILURE = 'Purchase.GET_CARDS_FAILURE'

export const SET_CARD = 'Purchase.SET_CARD'

export const SUBMIT_CARD_REQUEST = 'Purchase.SUBMIT_CARD_REQUEST'
export const SUBMIT_CARD_SUCCESS = 'Purchase.SUBMIT_CARD_SUCCESS'
export const SUBMIT_CARD_FAILURE = 'Purchase.SUBMIT_CARD_FAILURE'

export const SUBMIT_CARD_DETAILS_REQUEST = 'Purchase.SUBMIT_CARD_DETAILS_REQUEST'
export const SUBMIT_CARD_DETAILS_SUCCESS = 'Purchase.SUBMIT_CARD_DETAILS_SUCCESS'
export const SUBMIT_CARD_DETAILS_FAILURE = 'Purchase.SUBMIT_CARD_DETAILS_FAILURE'

export const SET_GIFT_TYPE = 'Purchase.SET_GIFT_TYPE'
export const CONTINUE_WITHOUT_GIFT = 'Purchase.CONTINUE_WITHOUT_GIFT'

export const SUBMIT_GIFT_TYPE_REQUEST = 'Purchase.SUBMIT_GIFT_TYPE_REQUEST'
export const SUBMIT_GIFT_TYPE_SUCCESS = 'Purchase.SUBMIT_GIFT_TYPE_SUCCESS'
export const SUBMIT_GIFT_TYPE_FAILURE = 'Purchase.SUBMIT_GIFT_TYPE_FAILURE'

export const SET_GIFT = 'Purchase.SET_GIFT'

export const SUBMIT_GIFT_REQUEST = 'Purchase.SUBMIT_GIFT_REQUEST'
export const SUBMIT_GIFT_SUCCESS = 'Purchase.SUBMIT_GIFT_SUCCESS'
export const SUBMIT_GIFT_FAILURE = 'Purchase.SUBMIT_GIFT_FAILURE'

export const SET_ADDING_CONTACTS_MODE = 'Purchase.SET_ADDING_CONTACTS_MODE'

export const PAYPAL = 'Purchase.PAYPAL'
export const CREDIT_CARD = 'Purchase.CREDIT_CARD'

export const SET_PAYMENT_METHOD = 'Purchase.SET_PAYMENT_METHOD'

export const REGISTER_REQUEST = 'Purchase.REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'Purchase.REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'Purchase.REGISTER_FAILURE'

export const CLEAR = 'Purchase.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const setOccasion = (occasion) => ({type: SET_OCCASION, occasion})

export const getOccasions = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASIONS_REQUEST})
  return fetch(`/occasions?take=100`, {
    method: 'GET',
    success: (res) => {
      dispatch({type: GET_OCCASIONS_SUCCESS, occasions: res.data})
    },
    failure: () => {
      dispatch({type: GET_OCCASIONS_FAILURE})
    }
  })
}

export const submitOccasion = () => (dispatch, getState, {history}) => {
  const {occasion} = getState().purchase
  if (!occasion) return
  history.push('/purchase/lettering-technique')
}

export const setLetteringTechnique = (letteringTechnique) => ({type: SET_LETTERING_TECHNIQUE, letteringTechnique})

export const submitLetteringTechnique = () => (dispatch, getState, {history}) => {
  const {letteringTechnique} = getState().purchase
  if (!letteringTechnique) return
  history.push('/purchase/card-style')
}

export const getCardStyles = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CARD_STYLES_REQUEST})
  return fetch(`/card-styles`, {
    method: 'GET',
    success: (res) => dispatch({type: GET_CARD_STYLES_SUCCESS, cardStyles: res.data}),
    failure: () => dispatch({type: GET_CARD_STYLES_FAILURE})
  })
}

export const setCardStyle = (cardStyle) => ({type: SET_CARD_STYLE, cardStyle})

export const submitCardStyle = () => (dispatch, getState, {history}) => {
  const {cardStyle} = getState().purchase
  if (!cardStyle) return
  history.push('/purchase/card-size')
}

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

export const submitCardDetails = () => (dispatch, getState, {history}) => {
  history.push('/purchase/gift-type')
}

export const setGiftType = (giftType) => ({type: SET_GIFT_TYPE, giftType})

export const submitGiftType = () => (dispatch, getState, {history}) => {
  history.push('/purchase/gift')
}

export const continueWithoutGift = () => (dispatch, getState, {history}) => {
  history.push('/purchase/gift')
}

export const setCard = (card) => ({type: SET_CARD, card})

export const submitCard = () => (dispatch, getState, {history}) => {
  const {card} = getState().purchase
  if (!card) return
  history.push('/purchase/personalize-card')
}

export const setGift = (gift) => ({type: SET_GIFT, gift})

export const submitGift = () => (dispatch, getState, {history}) => {
  const {gift} = getState().purchase
  if (!gift) return
  history.push('/purchase/create-account')
}

export const setAddingContactsMode = (addingContactsMode) => ({type: SET_ADDING_CONTACTS_MODE, addingContactsMode})

export const submitAddingContacts = () => (dispatch, getState, {history}) => {
  history.push('/purchase/confirmation')
}

export const submitShipping = () => (dispatch, getState, {history}) => {
  history.push('/purchase/payment-method')
}

export const setPaymentMethod = (paymentMethod) => ({type: SET_PAYMENT_METHOD, paymentMethod})

export const submitPaymentMethod = () => (dispatch, getState, {history}) => {
  const {paymentMethod} = getState().purchase
  if (!paymentMethod) return
  history.push('/purchase/payment')
}

export const submitPayment = () => (dispatch, getState, {history}) => {
  history.push('/purchase/completed')
}

export const register = (values) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: REGISTER_REQUEST})
  return fetch(`/signup`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: values,
    success: (res) => {
      dispatch({type: REGISTER_SUCCESS})
      dispatch(loginSuccess(res.data))
      history.push('/purchase/add-contacts')
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
  addingContactsMode: null,
  paymentMethod: null,
  cardStyles: [],
  cards: [],
}

export default createReducer(initialState, {
  [SET_OCCASION]: (state, {occasion}) => ({
    occasion,
  }),
  [GET_OCCASIONS_REQUEST]: (state, action) => ({
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
  [SUBMIT_CARD_DETAILS_REQUEST]: (state, {cardDetails}) => ({
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
  [SET_ADDING_CONTACTS_MODE]: (state, {addingContactsMode}) => ({
    addingContactsMode,
  }),
  [SET_PAYMENT_METHOD]: (state, {paymentMethod}) => ({
    paymentMethod,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
