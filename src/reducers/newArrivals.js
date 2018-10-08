import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import has from 'lodash/has'
import {FOOD_TYPE,NON_FOOD_TYPE} from '../constants'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_GIFTS_REQUEST = 'NewArrivals.GET_GIFTS_REQUEST'
export const GET_GIFTS_SUCCESS = 'NewArrivals.GET_GIFTS_SUCCESS'
export const GET_GIFTS_FAILURE = 'NewArrivals.GET_GIFTS_FAILURE'

export const GET_FOODS_REQUEST = 'NewArrivals.GET_FOODS_REQUEST'
export const GET_FOODS_SUCCESS = 'NewArrivals.GET_FOODS_SUCCESS'
export const GET_FOODS_FAILURE = 'NewArrivals.GET_FOODS_FAILURE'

export const GET_NONFOODS_REQUEST = 'NewArrivals.GET_NONFOODS_REQUEST'
export const GET_NONFOODS_SUCCESS = 'NewArrivals.GET_NONFOODS_SUCCESS'
export const GET_NONFOODS_FAILURE = 'NewArrivals.GET_NONFOODS_FAILURE'

export const GET_CARDS_REQUEST = 'NewArrivals.GET_CARDS_REQUEST'
export const GET_CARDS_SUCCESS = 'NewArrivals.GET_CARDS_SUCCESS'
export const GET_CARDS_FAILURE = 'NewArrivals.GET_CARDS_FAILURE'

export const CLEAR = 'Gifts.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getGifts = (params = {}) => (dispatch, getState, {fetch}) => {
  if(params.giftType)
  {
    if(params.giftType === FOOD_TYPE)
      dispatch({type: GET_FOODS_REQUEST, params})
    else if(params.giftType === NON_FOOD_TYPE)
      dispatch({type: GET_NONFOODS_REQUEST, params})
    else dispatch({type: GET_GIFTS_REQUEST, params})
  }
  else dispatch({type: GET_GIFTS_REQUEST, params})

  const {token} = dispatch(getToken())
  const {page, pageSize, search, giftType} = getState().newArrivals
  return fetch(`/gifts?${qs.stringify({
    filters: JSON.stringify({
      ...search ? {
        title: search,
      } : {},
      ...params.giftType ? {
        type: params.giftType,
      } : {},
    }),
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      if(params.giftType)
      {
        if(params.giftType === FOOD_TYPE)
          dispatch({type: GET_FOODS_SUCCESS, res})
        else if(params.giftType === NON_FOOD_TYPE)
          dispatch({type: GET_NONFOODS_SUCCESS, res})
        else dispatch({type: GET_GIFTS_SUCCESS, res})
      }
      else dispatch({type: GET_GIFTS_SUCCESS, res})

      
    },
    failure: () => {
      if(params.giftType)
      {
        if(params.giftType === FOOD_TYPE)
          dispatch({type: GET_FOODS_FAILURE})
        else if(params.giftType === NON_FOOD_TYPE)
          dispatch({type: GET_NONFOODS_FAILURE})
        else dispatch({type: GET_GIFTS_FAILURE})
      }
      else dispatch({type: GET_GIFTS_FAILURE})
    },
  })
}

export const getCards = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CARDS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize, search} = getState().cards
  return fetch(`/cards?${qs.stringify({
    ...search ? {
      filter_key: 'title',
      filter_value: search,
    } : {},
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_CARDS_SUCCESS, res}),
    failure: () => dispatch({type: GET_CARDS_FAILURE}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    gifts: false,
    foods:false,
    nonfoods:false,
    cards: false,
  },
  gifts: [],
  foods:[],
  nonfoods:[],
  cards: [],
  page: 1,
  pageSize: 8,
  search: undefined,
  giftType: FOOD_TYPE,
}

export default createReducer(initialState, {
  [GET_GIFTS_REQUEST]: (state, {params}) => ({
    search: has(params, 'search') ? params.search : state.search,
    giftType: has(params, 'giftType') ? params.giftType : state.giftType,
    loading: {
      ...state.loading,
      gifts: true,
    },
  }),
  [GET_GIFTS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    gifts: data,
    loading: {
      ...state.loading,
      gifts: false,
    },
  }),
  [GET_GIFTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      gifts: false,
    },
  }),
  
  [GET_FOODS_REQUEST]: (state, {params}) => ({
    search: has(params, 'search') ? params.search : state.search,
    giftType: has(params, 'giftType') ? params.giftType : state.giftType,
    loading: {
      ...state.loading,
      foods: true,
    },
  }),
  [GET_FOODS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    foods: data,
    loading: {
      ...state.loading,
      foods: false,
    },
  }),
  [GET_FOODS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      foods: false,
    },
  }),

  [GET_NONFOODS_REQUEST]: (state, {params}) => ({
    search: has(params, 'search') ? params.search : state.search,
    giftType: has(params, 'giftType') ? params.giftType : state.giftType,
    loading: {
      ...state.loading,
      nonfoods: true,
    },
  }),
  [GET_NONFOODS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    nonfoods: data,
    loading: {
      ...state.loading,
      nonfoods: false,
    },
  }),
  [GET_NONFOODS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      nonfoods: false,
    },
  }),

  [GET_CARDS_REQUEST]: (state, {params}) => ({
    search: has(params, 'search') ? params.search : state.search,
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
  //[CLEAR]: (state, action) => RESET_STORE,
})
