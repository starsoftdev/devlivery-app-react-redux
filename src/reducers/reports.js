import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'

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
  const {search, ordering, page, pageSize} = getState().reports
  return fetch(`/reports/scheduled-orders?${qs.stringify({
    search,
    ordering,
    page,
    page_size: pageSize,
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
  loading: {
    reports: false,
  },
  reports: [],
  reportsCount: 0,
  page: 1,
  pageSize: 20,
}

export default createReducer(initialState, {
  [GET_REPORTS_REQUEST]: (state, {params}) => ({
    // TODO add params
    loading: {
      ...state.loading,
      reports: true,
    },
  }),
  [GET_REPORTS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    reports: data,
    reportsCount: total,
    loading: {
      ...state.loading,
      reports: false,
    },
  }),
  [GET_REPORTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      reports: false,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
