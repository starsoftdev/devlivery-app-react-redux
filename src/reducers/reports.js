import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DATE_FORMAT, DEFAULT_PAGE_SIZE} from '../constants'
import has from 'lodash/has'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_REPORTS_REQUEST = 'Reports.GET_REPORTS_REQUEST'
export const GET_REPORTS_SUCCESS = 'Reports.GET_REPORTS_SUCCESS'
export const GET_REPORTS_FAILURE = 'Reports.GET_REPORTS_FAILURE'

export const GET_OCCASIONS_REQUEST = 'Reports.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Reports.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Reports.GET_OCCASIONS_FAILURE'

export const EXPORT_REPORT_REQUEST = 'Reports.EXPORT_REPORT_REQUEST'
export const EXPORT_REPORT_SUCCESS = 'Reports.EXPORT_REPORT_SUCCESS'
export const EXPORT_REPORT_FAILURE = 'Reports.EXPORT_REPORT_FAILURE'

export const CLEAR = 'Reports.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getReports = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_REPORTS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {occasion, page, pageSize, from, to} = getState().reports
  return fetch(`/reports/scheduled-orders?${qs.stringify({
    occasion,
    page,
    per_page: pageSize,
    from: from ? from.format(DATE_FORMAT) : undefined,
    to: to ? to.format(DATE_FORMAT) : undefined,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_REPORTS_SUCCESS, res}),
    failure: (err) =>{
      dispatch({type: GET_REPORTS_FAILURE})
    }, 
  })
}

export const getOccasions = ({search} = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASIONS_REQUEST})
  return fetch(`/occasions?${qs.stringify({
    take: 10,
    ...search ? {
      filter_key: 'title',
      filter_value: search,
    } : {},
  })}`, {
    method: 'GET',
    success: (res) => dispatch({type: GET_OCCASIONS_SUCCESS, occasions: res.data}),
    failure: () => dispatch({type: GET_OCCASIONS_FAILURE})
  })
}

export const exportReport = () => (dispatch, getState, {fetch}) => {
  dispatch({type: EXPORT_REPORT_REQUEST})
  const {token} = dispatch(getToken())
  // TODO add search params
  return fetch(`/reports/scheduled-orders?export`, {
    method: 'GET',
    token,
    // TODO change export file name
    fileName: `report.xls`,
    fileType: `application/vnd.ms-excel`,
    success: () => dispatch({type: EXPORT_REPORT_SUCCESS}),
    failure: () => dispatch({type: EXPORT_REPORT_FAILURE}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    reports: false,
    occasions: false,
  },
  reports: [],
  reportsCount: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  occasions: [],
  occasion: undefined,
  from: undefined,
  to: undefined,
}

export default createReducer(initialState, {
  [GET_REPORTS_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : DEFAULT_PAGE_SIZE,
    occasion: has(params, 'occasion') ? params.occasion : state.occasion,
    from: has(params, 'from') ? params.from : state.from,
    to: has(params, 'to') ? params.to : state.to,
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
  [GET_OCCASIONS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      occasions: true,
    },
  }),
  [GET_OCCASIONS_SUCCESS]: (state, {occasions}) => ({
    occasions,
    loading: {
      ...state.loading,
      occasions: false,
    },
  }),
  [GET_OCCASIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      occasions: false,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
