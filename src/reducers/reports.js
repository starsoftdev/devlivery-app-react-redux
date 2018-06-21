import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_REPORTS_REQUEST = 'Reports.GET_REPORTS_REQUEST'
export const GET_REPORTS_SUCCESS = 'Reports.GET_REPORTS_SUCCESS'
export const GET_REPORTS_FAILURE = 'Reports.GET_REPORTS_FAILURE'

export const CLEAR = 'Reports.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getReports = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_REPORTS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {ordering, page, pageSize} = getState().reports
  return fetch(`/reports/scheduled-orders?${qs.stringify({
    ordering,
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_REPORTS_SUCCESS, res}),
    failure: () => dispatch({type: GET_REPORTS_FAILURE}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  reports: [],
  reportsCount: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

export default createReducer(initialState, {
  [GET_REPORTS_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : DEFAULT_PAGE_SIZE,
    loading: true,
  }),
  [GET_REPORTS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    reports: data,
    reportsCount: total,
    loading: false,

  }),
  [GET_REPORTS_FAILURE]: (state, action) => ({
    loading: false,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
