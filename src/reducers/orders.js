import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'
import moment from 'moment'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_ORDERS_REQUEST = 'Orders.GET_ORDERS_REQUEST'
export const GET_ORDERS_SUCCESS = 'Orders.GET_ORDERS_SUCCESS'
export const GET_ORDERS_FAILURE = 'Orders.GET_ORDERS_FAILURE'

export const GET_EVENTS_REQUEST = 'Orders.GET_EVENTS_REQUEST'
export const GET_EVENTS_SUCCESS = 'Orders.GET_EVENTS_SUCCESS'
export const GET_EVENTS_FAILURE = 'Orders.GET_EVENTS_FAILURE'

export const CLEAR = 'Orders.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getOrders = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_ORDERS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search, ordering, page, pageSize} = getState().orders
  return fetch(`/orders-history?${qs.stringify({
    search,
    ordering,
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_ORDERS_SUCCESS, res}),
    failure: () => dispatch({type: GET_ORDERS_FAILURE}),
  })
}

export const getEvents = (date) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_EVENTS_REQUEST, date: date.format()})
  const {token} = dispatch(getToken())
  return fetch(`/contact-reminders?${qs.stringify({
    month: date.format('MM'),
    year: date.format('YYYY'),
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_EVENTS_SUCCESS, events: res.data}),
    failure: () => dispatch({type: GET_EVENTS_FAILURE}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    orders: false,
    events: false,
  },
  orders: [],
  ordersCount: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: undefined,
  events: [],
  date: moment().format(),
}

export default createReducer(initialState, {
  [GET_ORDERS_REQUEST]: (state, {params}) => ({
    // do not send search param if string is empty
    search: params.search !== undefined ? (params.search || undefined) : state.search,
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : DEFAULT_PAGE_SIZE,
    loading: {
      ...state.loading,
      orders: true,
    },
  }),
  [GET_ORDERS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    orders: data,
    ordersCount: total,
    loading: {
      ...state.loading,
      orders: false,
    },
  }),
  [GET_ORDERS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      orders: false,
    },
  }),
  [GET_EVENTS_REQUEST]: (state, {date}) => ({
    date,
    loading: {
      ...state.loading,
      events: true,
    },
  }),
  [GET_EVENTS_SUCCESS]: (state, {events}) => ({
    events,
    loading: {
      ...state.loading,
      events: false,
    },
  }),
  [GET_EVENTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      events: false,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
