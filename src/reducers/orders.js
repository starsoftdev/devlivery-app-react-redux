import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_ORDERS_REQUEST = 'Orders.GET_ORDERS_REQUEST'
export const GET_ORDERS_SUCCESS = 'Orders.GET_ORDERS_SUCCESS'
export const GET_ORDERS_FAILURE = 'Orders.GET_ORDERS_FAILURE'

export const CLEAR = 'Orders.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getOrders = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_ORDERS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search, ordering, page, pageSize} = getState().orders
  return fetch(`/orders?${qs.stringify({
    search,
    ordering,
    page,
    page_size: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_ORDERS_SUCCESS, res}),
    failure: () => dispatch({type: GET_ORDERS_FAILURE}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    orders: false,
  },
  orders: [],
  ordersCount: 0,
  page: 1,
  pageSize: 20,
}

export default createReducer(initialState, {
  [GET_ORDERS_REQUEST]: (state, {params}) => ({
    search: params.search !== undefined ? params.search : state.search,
    ordering: params.sorter ? `${params.sorter.order === 'descend' ? '-' : ''}${params.sorter.field}` : state.ordering,
    page: params.pagination ? params.pagination.current : 1,
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
  [CLEAR]: (state, action) => RESET_STORE,
})
