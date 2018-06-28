import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'
import {REMOVE_CONTACT_FAILURE, REMOVE_CONTACT_REQUEST, REMOVE_CONTACT_SUCCESS} from './contacts'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_BUNDLES_REQUEST = 'Bundles.GET_BUNDLES_REQUEST'
export const GET_BUNDLES_SUCCESS = 'Bundles.GET_BUNDLES_SUCCESS'
export const GET_BUNDLES_FAILURE = 'Bundles.GET_BUNDLES_FAILURE'

export const REMOVE_BUNDLE_REQUEST = 'Bundles.REMOVE_BUNDLE_REQUEST'
export const REMOVE_BUNDLE_SUCCESS = 'Bundles.REMOVE_BUNDLE_SUCCESS'
export const REMOVE_BUNDLE_FAILURE = 'Bundles.REMOVE_BUNDLE_FAILURE'

export const CLEAR = 'Bundles.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getBundles = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_BUNDLES_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search, page, pageSize} = getState().bundles
  return fetch(`/bundles?${qs.stringify({
    ...search ? {
      filter_key: 'title',
      filter_value: search,
    } : {},
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_BUNDLES_SUCCESS, res}),
    failure: () => dispatch({type: GET_BUNDLES_FAILURE}),
  })
}

export const removeBundle = (bundle) => (dispatch, getState, {fetch}) => {
  dispatch({type: REMOVE_BUNDLE_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/bundles/${bundle.id}`, {
    method: 'DELETE',
    token,
    success: () => {
      dispatch({type: REMOVE_BUNDLE_SUCCESS})
      dispatch(getBundles())
    },
    failure: () => dispatch({type: REMOVE_BUNDLE_FAILURE}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    bundles: false,
    removingBundle: false,
  },
  bundles: [],
  bundlesCount: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

export default createReducer(initialState, {
  [GET_BUNDLES_REQUEST]: (state, {params}) => ({
    // do not send search param if string is empty
    search: params.search !== undefined ? (params.search || undefined) : state.search,
    page: params.page || 1,
    pageSize: params.pageSize || state.pageSize,
    loading: {
      ...state.loading,
      bundles: true,
    },
  }),
  [GET_BUNDLES_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    bundles: data,
    bundlesCount: total,
    loading: {
      ...state.loading,
      bundles: false,
    },
  }),
  [GET_BUNDLES_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      bundles: false,
    },
  }),
  [REMOVE_BUNDLE_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      removingBundle: true,
    },
  }),
  [REMOVE_BUNDLE_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      removingBundle: false,
    },
  }),
  [REMOVE_BUNDLE_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      removingBundle: false,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
