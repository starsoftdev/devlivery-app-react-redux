import createReducer, {RESET_STORE} from '../createReducer'

// ------------------------------------
// Constants
// ------------------------------------
export const HANDWRITTEN = 'handwritten'
export const PRINTED = 'printed'

export const SET_OCCASION = 'Purchase.SET_OCCASION'

export const GET_OCCASIONS_REQUEST = 'Purchase.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Purchase.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Purchase.GET_OCCASIONS_FAILURE'

export const SUBMIT_OCCASION_REQUEST = 'Purchase.SUBMIT_OCCASION_REQUEST'
export const SUBMIT_OCCASION_SUCCESS = 'Purchase.SUBMIT_OCCASION_SUCCESS'
export const SUBMIT_OCCASION_FAILURE = 'Purchase.SUBMIT_OCCASION_FAILURE'

export const SET_LETTERING_TECHNIQUE = 'Purchase.SET_LETTERING_TECHNIQUE'

export const SUBMIT_LETTERING_TECHNIQUE_REQUEST = 'Purchase.SUBMIT_LETTERING_TECHNIQUE_REQUEST'
export const SUBMIT_LETTERING_TECHNIQUE_SUCCESS = 'Purchase.SUBMIT_LETTERING_TECHNIQUE_SUCCESS'
export const SUBMIT_LETTERING_TECHNIQUE_FAILURE = 'Purchase.SUBMIT_LETTERING_TECHNIQUE_FAILURE'

export const SET_CARD_STYLE = 'Purchase.SET_CARD_STYLE'

export const SUBMIT_CARD_STYLE_REQUEST = 'Purchase.SUBMIT_CARD_STYLE_REQUEST'
export const SUBMIT_CARD_STYLE_SUCCESS = 'Purchase.SUBMIT_CARD_STYLE_SUCCESS'
export const SUBMIT_CARD_STYLE_FAILURE = 'Purchase.SUBMIT_CARD_STYLE_FAILURE'

export const SET_CARD_SIZE = 'Purchase.SET_CARD_SIZE'

export const SUBMIT_CARD_SIZE_REQUEST = 'Purchase.SUBMIT_CARD_SIZE_REQUEST'
export const SUBMIT_CARD_SIZE_SUCCESS = 'Purchase.SUBMIT_CARD_SIZE_SUCCESS'
export const SUBMIT_CARD_SIZE_FAILURE = 'Purchase.SUBMIT_CARD_SIZE_FAILURE'

export const SET_CARD = 'Purchase.SET_CARD'

export const SUBMIT_CARD_REQUEST = 'Purchase.SUBMIT_CARD_REQUEST'
export const SUBMIT_CARD_SUCCESS = 'Purchase.SUBMIT_CARD_SUCCESS'
export const SUBMIT_CARD_FAILURE = 'Purchase.SUBMIT_CARD_FAILURE'

export const SUBMIT_CARD_DETAILS_REQUEST = 'Purchase.SUBMIT_CARD_DETAILS_REQUEST'
export const SUBMIT_CARD_DETAILS_SUCCESS = 'Purchase.SUBMIT_CARD_DETAILS_SUCCESS'
export const SUBMIT_CARD_DETAILS_FAILURE = 'Purchase.SUBMIT_CARD_DETAILS_FAILURE'

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

export const submitOccasion = () => (dispatch, getState, {fetch, history}) => {
  const {occasion} = getState().purchase
  if (!occasion) return
  dispatch({type: SUBMIT_OCCASION_REQUEST})
  history.push('/purchase/lettering-technique')
  return fetch(`/guest/set-occasion`, {
    method: 'POST',
    body: {
      occasion_id: occasion,
    },
    success: () => dispatch({type: SUBMIT_OCCASION_SUCCESS}),
    failure: () => dispatch({type: SUBMIT_OCCASION_FAILURE})
  })
}

export const setLetteringTechnique = (letteringTechnique) => ({type: SET_LETTERING_TECHNIQUE, letteringTechnique})

export const submitLetteringTechnique = () => (dispatch, getState, {fetch, history}) => {
  const {letteringTechnique} = getState().purchase
  if (!letteringTechnique) return
  dispatch({type: SUBMIT_LETTERING_TECHNIQUE_REQUEST})
  history.push('/purchase/card-style')
  return fetch(`/guest/set-lettering-technique`, {
    method: 'POST',
    body: {
      lettering_technique: letteringTechnique,
    },
    success: () => dispatch({type: SUBMIT_LETTERING_TECHNIQUE_SUCCESS}),
    failure: () => dispatch({type: SUBMIT_LETTERING_TECHNIQUE_FAILURE})
  })
}

export const setCardStyle = (cardStyle) => ({type: SET_CARD_STYLE, cardStyle})

export const submitCardStyle = () => (dispatch, getState, {fetch, history}) => {
  const {cardStyle} = getState().purchase
  if (!cardStyle) return
  dispatch({type: SUBMIT_CARD_STYLE_REQUEST})
  history.push('/purchase/card-size')
  return fetch(`/guest/set-card-style`, {
    method: 'POST',
    body: {
      card_style: cardStyle,
    },
    success: () => dispatch({type: SUBMIT_CARD_STYLE_SUCCESS}),
    failure: () => dispatch({type: SUBMIT_CARD_STYLE_FAILURE})
  })
}

export const setCardSize = (cardSize) => ({type: SET_CARD_SIZE, cardSize})

export const submitCardSize = () => (dispatch, getState, {fetch, history}) => {
  const {cardSize} = getState().purchase
  if (!cardSize) return
  dispatch({type: SUBMIT_CARD_SIZE_REQUEST})
  history.push('/purchase/card')
  return fetch(`/guest/set-card-size`, {
    method: 'POST',
    body: {
      card_size: cardSize,
    },
    success: () => dispatch({type: SUBMIT_CARD_SIZE_SUCCESS}),
    failure: () => dispatch({type: SUBMIT_CARD_SIZE_FAILURE})
  })
}

export const setCard = (card) => ({type: SET_CARD, card})

export const submitCard = () => (dispatch, getState, {fetch, history}) => {
  const {card} = getState().purchase
  if (!card) return
  dispatch({type: SUBMIT_CARD_REQUEST})
  history.push('/purchase/personalize-card')
  return fetch(`/guest/set-card`, {
    method: 'POST',
    body: {
      card,
    },
    success: () => dispatch({type: SUBMIT_CARD_SUCCESS}),
    failure: () => dispatch({type: SUBMIT_CARD_FAILURE})
  })
}

export const submitCardDetails = (cardDetails) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: SUBMIT_CARD_DETAILS_REQUEST, cardDetails})
  history.push('/purchase/gift-type')
  return fetch(`/guest/personalize-card`, {
    method: 'POST',
    body: {
      ...cardDetails,
    },
    success: () => dispatch({type: SUBMIT_CARD_DETAILS_SUCCESS}),
    failure: () => dispatch({type: SUBMIT_CARD_DETAILS_FAILURE})
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
  [SET_CARD_STYLE]: (state, {cardStyle}) => ({
    cardStyle,
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
  [CLEAR]: (state, action) => RESET_STORE,
})
