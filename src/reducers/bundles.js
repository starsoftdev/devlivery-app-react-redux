import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'
import has from 'lodash/has'
import {message} from 'antd'
import { getFormErrors, showErrorMessage } from '../utils'
import {getIntl} from './intl';
import formMessages from '../formMessages'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_BUNDLES_REQUEST = 'Bundles.GET_BUNDLES_REQUEST'
export const GET_BUNDLES_SUCCESS = 'Bundles.GET_BUNDLES_SUCCESS'
export const GET_BUNDLES_FAILURE = 'Bundles.GET_BUNDLES_FAILURE'

export const REMOVE_BUNDLE_REQUEST = 'Bundles.REMOVE_BUNDLE_REQUEST'
export const REMOVE_BUNDLE_SUCCESS = 'Bundles.REMOVE_BUNDLE_SUCCESS'
export const REMOVE_BUNDLE_FAILURE = 'Bundles.REMOVE_BUNDLE_FAILURE'

export const OPEN_BUNDLE_DETAILS_MODAL = 'Bundles.OPEN_BUNDLE_DETAILS_MODAL'
export const CLOSE_BUNDLE_DETAILS_MODAL = 'Bundles.CLOSE_BUNDLE_DETAILS_MODAL'

export const CLEAR = 'Bundles.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getBundles = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_BUNDLES_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search, page, pageSize} = getState().bundles
  return fetch(`/bundles?filter_key=saved&filter_value=1&${qs.stringify({
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
  const {intl} = dispatch(getIntl());
  dispatch({type: REMOVE_BUNDLE_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/bundles/${bundle.id}`, {
    method: 'DELETE',
    token,
    success: (res) => {
      message.success(intl.formatMessage(formMessages.removed_bundle));
      dispatch({type: REMOVE_BUNDLE_SUCCESS})
      dispatch(getBundles())
    },
    failure: (err) => {
      showErrorMessage(err);
      dispatch({type: REMOVE_BUNDLE_FAILURE})
    },
  })
}

export const openBundleDetailsModal = (bundleDetails) => ({type: OPEN_BUNDLE_DETAILS_MODAL, bundleDetails})

export const closeBundleDetailsModal = () => ({type: CLOSE_BUNDLE_DETAILS_MODAL})

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
  bundleDetailsModalOpened: false,
  bundleDetails: null,
}

export default createReducer(initialState, {
  [GET_BUNDLES_REQUEST]: (state, {params}) => ({
    search: has(params, 'search') ? params.search : state.search,
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
  [OPEN_BUNDLE_DETAILS_MODAL]: (state, {bundleDetails}) => ({
    bundleDetailsModalOpened: true,
    bundleDetails,
  }),
  [CLOSE_BUNDLE_DETAILS_MODAL]: (state, action) => ({
    bundleDetailsModalOpened: false,
    bundleDetails: null,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
