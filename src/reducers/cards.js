import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import has from 'lodash/has'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_CARDS_REQUEST = 'Cards.GET_CARDS_REQUEST'
export const GET_CARDS_SUCCESS = 'Cards.GET_CARDS_SUCCESS'
export const GET_CARDS_FAILURE = 'Cards.GET_CARDS_FAILURE'

export const GET_OCCASIONS_REQUEST = 'Cards.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Cards.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Cards.GET_OCCASIONS_FAILURE'

export const GET_OCCASION_TYPES_REQUEST = 'Cards.GET_OCCASION_TYPES_REQUEST'
export const GET_OCCASION_TYPES_SUCCESS = 'Cards.GET_OCCASION_TYPES_SUCCESS'
export const GET_OCCASION_TYPES_FAILURE = 'Cards.GET_OCCASION_TYPES_FAILURE'

export const GET_CARD_STYLES_REQUEST = 'Cards.GET_CARD_STYLES_REQUEST'
export const GET_CARD_STYLES_SUCCESS = 'Cards.GET_CARD_STYLES_SUCCESS'
export const GET_CARD_STYLES_FAILURE = 'Cards.GET_CARD_STYLES_FAILURE'

export const CLEAR_FILTERS = 'Cards.CLEAR_FILTERS'
export const CLEAR = 'Cards.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getCards = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CARDS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize, search, occasion, cardStyle, cardSize} = getState().cards
  return fetch(`/cards?${qs.stringify({
    filters: JSON.stringify({
      ...search ? {
        title: search,
      } : {},
      ...occasion ? {
        occasion_id: occasion,
      } : {},
      ...cardStyle ? {
        style: cardStyle,
      } : {},
      ...cardSize ? {
        card_format: cardSize,
      } : {},
    }),
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_CARDS_SUCCESS, res}),
    failure: () => dispatch({type: GET_CARDS_FAILURE}),
  })
}

export const getOccasions = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASIONS_REQUEST, params})
  const {occasionType} = getState().cards
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

export const getCardStyles = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CARD_STYLES_REQUEST})
  return fetch(`/card-styles`, {
    method: 'GET',
    success: (res) => dispatch({type: GET_CARD_STYLES_SUCCESS, cardStyles: res.data}),
    failure: () => dispatch({type: GET_CARD_STYLES_FAILURE})
  })
}

export const clearFilters = () => (dispatch, getState) => {
  dispatch({type: CLEAR_FILTERS})
  dispatch(getCards())
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    cards: false,
  },
  cards: [],
  cardsCount: 0,
  page: 1,
  pageSize: 16,
  search: undefined,
  cardSize: undefined,
  occasionTypes: [],
  occasionType: undefined,
  cardStyles: [],
  cardStyle: undefined,
  occasions: [],
  occasion: undefined,
}

export default createReducer(initialState, {
  [GET_CARDS_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    search: has(params, 'search') ? params.search : state.search,
    cardSize: has(params, 'cardSize') ? params.cardSize : state.cardSize,
    occasion: has(params, 'occasion') ? params.occasion : state.occasion,
    cardStyle: has(params, 'cardStyle') ? params.cardStyle : state.cardStyle,
    loading: {
      ...state.loading,
      cards: true,
    },
  }),
  [GET_CARDS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    cards: data,
    cardsCount: total,
    loading: {
      ...state.loading,
      cards: false,
    },
  }),
  [GET_CARDS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      cards: false,
    },
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
  [GET_CARD_STYLES_SUCCESS]: (state, {cardStyles}) => ({
    cardStyles,
  }),
  [CLEAR_FILTERS]: (state, action) => ({
    occasion: undefined,
    cardSize: undefined,
    cardStyle: undefined,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
