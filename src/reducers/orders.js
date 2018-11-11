import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'
import moment from 'moment'
import has from 'lodash/has'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_ORDERS_REQUEST = 'Orders.GET_ORDERS_REQUEST'
export const GET_ORDERS_SUCCESS = 'Orders.GET_ORDERS_SUCCESS'
export const GET_ORDERS_FAILURE = 'Orders.GET_ORDERS_FAILURE'

export const GET_EVENTS_REQUEST = 'Orders.GET_EVENTS_REQUEST'
export const GET_EVENTS_SUCCESS = 'Orders.GET_EVENTS_SUCCESS'
export const GET_EVENTS_FAILURE = 'Orders.GET_EVENTS_FAILURE'

export const GET_UPCOMING_EVENTS_REQUEST = 'Orders.GET_UPCOMING_EVENTS_REQUEST'
export const GET_UPCOMING_EVENTS_SUCCESS = 'Orders.GET_UPCOMING_EVENTS_SUCCESS'
export const GET_UPCOMING_EVENTS_FAILURE = 'Orders.GET_UPCOMING_EVENTS_FAILURE'

export const OPEN_CALENDAR_EVENTS_MODAL = 'Orders.OPEN_CALENDAR_EVENTS_MODAL'
export const CLOSE_CALENDAR_EVENTS_MODAL = 'Orders.CLOSE_CALENDAR_EVENTS_MODAL'

export const OPEN_ORDER_DETAILS_MODAL = 'Orders.OPEN_ORDER_DETAILS_MODAL'
export const CLOSE_ORDER_DETAILS_MODAL = 'Orders.CLOSE_ORDER_DETAILS_MODAL'

export const GET_ORDER_DETAILS_REQUEST = 'Orders.GET_ORDER_DETAILS_REQUEST'
export const GET_ORDER_DETAILS_SUCCESS = 'Orders.GET_ORDER_DETAILS_SUCCESS'
export const GET_ORDER_DETAILS_FAILURE = 'Orders.GET_ORDER_DETAILS_FAILURE'

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
    'three-months': '',
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_EVENTS_SUCCESS, events: res.data}),
    failure: () => dispatch({type: GET_EVENTS_FAILURE}),
  })
}

export const getUpcomingEvents = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_UPCOMING_EVENTS_REQUEST,params})
  const {token} = dispatch(getToken())
  const {upcomingpage, upcomingpageSize} = getState().orders
  console.log(`/contact-reminders?${qs.stringify({
    upcoming: '',
    page: upcomingpage,
    per_page: upcomingpageSize,
  })}`);
  return fetch(`/contact-reminders?${qs.stringify({
    upcoming: '',
    sort_by_date:'',
    page: upcomingpage,
    per_page: upcomingpageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      console.log('upcoming',res);
      dispatch({type: GET_UPCOMING_EVENTS_SUCCESS, res})
    },
    failure: (err) => {
      console.log('error',err);
      dispatch({type: GET_UPCOMING_EVENTS_FAILURE})
    },
  })
}

export const openCalendarEventsModal = (selectedDate) => ({type: OPEN_CALENDAR_EVENTS_MODAL, selectedDate})

export const closeCalendarEventsModal = () => ({type: CLOSE_CALENDAR_EVENTS_MODAL})

export const openOrderDetailsModal = (order) => (dispatch, getState) => {
  dispatch({type: OPEN_ORDER_DETAILS_MODAL})
  dispatch(getOrderDetails(order))
}

export const closeOrderDetailsModal = () => (dispatch, getState, {fetch,history}) => {
  dispatch({type: CLOSE_ORDER_DETAILS_MODAL})
  history.push('/dashboard/orders');
}

export const getOrderDetails = (order) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: GET_ORDER_DETAILS_REQUEST})
  return fetch(`/order-confirmation?${qs.stringify({
    order_id: order.id,
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_ORDER_DETAILS_SUCCESS, orderDetails: res.data})
    },
    failure: () => {
      dispatch({type: GET_ORDER_DETAILS_FAILURE})
    },
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
    upcomingEvents: false,
    orderDetails: false,
  },
  orders: [],
  ordersCount: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: undefined,
  events: [],
  date: moment().format(),
  calendarEventsModalOpened: false,
  selectedDate: null,
  orderDetailsModalOpened: false,
  orderDetails: null,
  upcomingEvents: [],
  upcomingCount: 0,
  upcomingpage: 1,
  upcomingpageSize: 3,
}

export default createReducer(initialState, {
  [GET_ORDERS_REQUEST]: (state, {params}) => ({
    search: has(params, 'search') ? params.search : state.search,
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
  [OPEN_CALENDAR_EVENTS_MODAL]: (state, {selectedDate}) => ({
    calendarEventsModalOpened: true,
    selectedDate,
  }),
  [CLOSE_CALENDAR_EVENTS_MODAL]: (state, action) => ({
    calendarEventsModalOpened: false,
    selectedDate: null,
  }),
  [OPEN_ORDER_DETAILS_MODAL]: (state, action) => ({
    orderDetailsModalOpened: true,
  }),
  [CLOSE_ORDER_DETAILS_MODAL]: (state, action) => ({
    orderDetailsModalOpened: false,
    orderDetails: null,
  }),
  [GET_ORDER_DETAILS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      orderDetails: true,
    },
  }),
  [GET_ORDER_DETAILS_SUCCESS]: (state, {orderDetails}) => ({
    orderDetails,
    loading: {
      ...state.loading,
      orderDetails: false,
    },
  }),
  [GET_ORDER_DETAILS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      orderDetails: false,
    },
  }),
  [GET_UPCOMING_EVENTS_REQUEST]: (state, {params}) => ({
    upcomingpage: params.pagination ? params.pagination.current : 1,
    upcomingpageSize: params.pagination ? params.pagination.pageSize : 3,
    loading: {
      ...state.loading,
      upcomingEvents: true,
    },
  }),
  [GET_UPCOMING_EVENTS_SUCCESS]: (state, {res: {data, total}}) => ({
    upcomingEvents:data,
    upcomingCount: total,
    loading: {
      ...state.loading,
      upcomingEvents: false,
    },
  }),
  [GET_UPCOMING_EVENTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      upcomingEvents: false,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
