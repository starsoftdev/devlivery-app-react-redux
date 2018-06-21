import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONTACTS_REQUEST = 'Contacts.GET_CONTACTS_REQUEST'
export const GET_CONTACTS_SUCCESS = 'Contacts.GET_CONTACTS_SUCCESS'
export const GET_CONTACTS_FAILURE = 'Contacts.GET_CONTACTS_FAILURE'

export const CLEAR = 'Contacts.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getContacts = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACTS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search, page, pageSize} = getState().contacts
  return fetch(`/view-contacts?${qs.stringify({
    ...search ? {
      name: search
    } : {},
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_CONTACTS_SUCCESS, res}),
    failure: () => dispatch({type: GET_CONTACTS_FAILURE}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  contacts: [],
  contactsCount: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

export default createReducer(initialState, {
  [GET_CONTACTS_REQUEST]: (state, {params}) => ({
    // do not send search param if string is empty
    search: params.search !== undefined ? (params.search || undefined) : state.search,
    page: params.page || 1,
    pageSize: params.pageSize || state.pageSize,
    loading: true,
  }),
  // TODO add pagination on backend side
  [GET_CONTACTS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    contacts: data,
    contactsCount: total,
    loading: false,
  }),
  [GET_CONTACTS_FAILURE]: (state, action) => ({
    loading: false,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
