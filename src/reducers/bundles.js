import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_BUNDLES_REQUEST = 'Bundles.GET_BUNDLES_REQUEST'
export const GET_BUNDLES_SUCCESS = 'Bundles.GET_BUNDLES_SUCCESS'
export const GET_BUNDLES_FAILURE = 'Bundles.GET_BUNDLES_FAILURE'

export const CLEAR = 'Bundles.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getBundles = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_BUNDLES_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search, ordering, page, pageSize} = getState().bundles
  return fetch(`/bundles?${qs.stringify({
    search,
    ordering,
    page,
    page_size: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_BUNDLES_SUCCESS, res}),
    failure: () => dispatch({type: GET_BUNDLES_FAILURE}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    bundles: false,
  },
  bundles: [],
  bundlesCount: 0,
  page: 1,
  pageSize: 20,
}

export default createReducer(initialState, {
  [GET_BUNDLES_REQUEST]: (state, {params}) => ({
    // TODO add params
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
  [CLEAR]: (state, action) => RESET_STORE,
})
