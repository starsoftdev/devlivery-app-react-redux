import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DATE_FORMAT, DEFAULT_PAGE_SIZE} from '../constants'
import {message} from 'antd'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONTACTS_REQUEST = 'Contacts.GET_CONTACTS_REQUEST'
export const GET_CONTACTS_SUCCESS = 'Contacts.GET_CONTACTS_SUCCESS'
export const GET_CONTACTS_FAILURE = 'Contacts.GET_CONTACTS_FAILURE'

export const ADD_CONTACT_REQUEST = 'Contacts.ADD_CONTACT_REQUEST'
export const ADD_CONTACT_SUCCESS = 'Contacts.ADD_CONTACT_SUCCESS'
export const ADD_CONTACT_FAILURE = 'Contacts.ADD_CONTACT_FAILURE'

export const REMOVE_CONTACT_REQUEST = 'Contacts.REMOVE_CONTACT_REQUEST'
export const REMOVE_CONTACT_SUCCESS = 'Contacts.REMOVE_CONTACT_SUCCESS'
export const REMOVE_CONTACT_FAILURE = 'Contacts.REMOVE_CONTACT_FAILURE'

export const GET_OCCASIONS_REQUEST = 'Contacts.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Contacts.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Contacts.GET_OCCASIONS_FAILURE'

export const GET_GROUPS_REQUEST = 'Contacts.GET_GROUPS_REQUEST'
export const GET_GROUPS_SUCCESS = 'Contacts.GET_GROUPS_SUCCESS'
export const GET_GROUPS_FAILURE = 'Contacts.GET_GROUPS_FAILURE'

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

export const addContact = ({birthday, ...values}, form) => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_CONTACT_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contacts`, {
    method: 'POST',
    body: {
      dob: birthday.format(DATE_FORMAT),
      ...values,
    },
    token,
    success: (res) => {
      dispatch({type: ADD_CONTACT_SUCCESS, res})
      form.resetFields()
    },
    failure: () => {
      dispatch({type: ADD_CONTACT_FAILURE})
      message.error('Something went wrong. Please try again.')
    }
  })
}

export const removeContact = (contact) => (dispatch, getState, {fetch}) => {
  dispatch({type: REMOVE_CONTACT_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contacts/${contact.id}`, {
    method: 'DELETE',
    token,
    success: (res) => {
      dispatch({type: REMOVE_CONTACT_SUCCESS, res})
      dispatch(getContacts())
    },
    failure: () => dispatch({type: REMOVE_CONTACT_FAILURE}),
  })
}

export const getOccasions = ({search} = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASIONS_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/occasions?${qs.stringify({
    take: 10,
    ...search ? {
      filter_key: 'title',
      filter_value: search,
    } : {},
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_OCCASIONS_SUCCESS, occasions: res.data}),
    failure: () => dispatch({type: GET_OCCASIONS_FAILURE})
  })
}

export const getGroups = ({search} = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_GROUPS_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contact-groups?${qs.stringify({
    take: 10,
    ...search ? {
      filter_key: 'title',
      filter_value: search,
    } : {},
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_GROUPS_SUCCESS, groups: res.data}),
    failure: () => dispatch({type: GET_GROUPS_FAILURE})
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    contacts: false,
    addingContact: false,
    removingContact: false,
    occasions: false,
    groups: false,
  },
  contacts: [],
  contactsCount: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  occasions: [],
  groups: [],
}

export default createReducer(initialState, {
  [GET_CONTACTS_REQUEST]: (state, {params}) => ({
    // do not send search param if string is empty
    search: params.search !== undefined ? (params.search || undefined) : state.search,
    page: params.page || 1,
    pageSize: params.pageSize || state.pageSize,
    loading: {
      ...state.loading,
      contacts: true,
    },
  }),
  [GET_CONTACTS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    contacts: data,
    contactsCount: total,
    loading: {
      ...state.loading,
      contacts: false,
    },
  }),
  [GET_CONTACTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      contacts: false,
    },
  }),
  [ADD_CONTACT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      addingContact: true,
    },
  }),
  [ADD_CONTACT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      addingContact: false,
    },
  }),
  [ADD_CONTACT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      addingContact: false,
    },
  }),
  [REMOVE_CONTACT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      removingContact: true,
    },
  }),
  [REMOVE_CONTACT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      removingContact: false,
    },
  }),
  [REMOVE_CONTACT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      removingContact: false,
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
  [GET_GROUPS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      groups: true,
    },
  }),
  [GET_GROUPS_SUCCESS]: (state, {groups}) => ({
    groups,
    loading: {
      ...state.loading,
      groups: false,
    },
  }),
  [GET_GROUPS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      groups: false,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
