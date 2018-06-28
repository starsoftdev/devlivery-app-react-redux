import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DATE_FORMAT, DEFAULT_PAGE_SIZE} from '../constants'
import {message} from 'antd'
import {generateUrl} from '../router'
import {CONTACTS_ROUTE} from '../routes'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONTACTS_REQUEST = 'Contacts.GET_CONTACTS_REQUEST'
export const GET_CONTACTS_SUCCESS = 'Contacts.GET_CONTACTS_SUCCESS'
export const GET_CONTACTS_FAILURE = 'Contacts.GET_CONTACTS_FAILURE'

export const GET_CONTACT_REQUEST = 'Contacts.GET_CONTACT_REQUEST'
export const GET_CONTACT_SUCCESS = 'Contacts.GET_CONTACT_SUCCESS'
export const GET_CONTACT_FAILURE = 'Contacts.GET_CONTACT_FAILURE'

export const ADD_CONTACT_REQUEST = 'Contacts.ADD_CONTACT_REQUEST'
export const ADD_CONTACT_SUCCESS = 'Contacts.ADD_CONTACT_SUCCESS'
export const ADD_CONTACT_FAILURE = 'Contacts.ADD_CONTACT_FAILURE'

export const EDIT_CONTACT_REQUEST = 'Contacts.EDIT_CONTACT_REQUEST'
export const EDIT_CONTACT_SUCCESS = 'Contacts.EDIT_CONTACT_SUCCESS'
export const EDIT_CONTACT_FAILURE = 'Contacts.EDIT_CONTACT_FAILURE'

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

export const getContact = (contactId) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACT_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contacts?${qs.stringify({
    filter_key: 'id',
    filter_value: contactId,
    with: 'reminders,groups,addresses'
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_CONTACT_SUCCESS, contact: res.data && res.data[0]})
    },
    failure: () => dispatch({type: GET_CONTACT_FAILURE})
  })
}

export const addContact = ({birthday, reminders, ...values}, form) => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_CONTACT_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/add-contact-manually`, {
    method: 'POST',
    body: {
      ...values,
      contact: {
        ...values.contact,
        dob: birthday.format(DATE_FORMAT),
      },
      reminders: reminders.map(item => ({
        ...item,
        date: item.date.format(DATE_FORMAT)
      }))
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

export const editContact = ({birthday, reminders, ...values}) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: EDIT_CONTACT_REQUEST})
  const {token} = dispatch(getToken())
  const {contact} = getState().contacts
  return fetch(`/edit-contact`, {
    method: 'POST',
    body: {
      ...values,
      contact: {
        id: contact.id,
        ...values.contact,
        dob: birthday.format(DATE_FORMAT),
      },
      reminders: reminders.map(item => ({
        ...item,
        date: item.date.format(DATE_FORMAT)
      }))
    },
    token,
    success: () => {
      dispatch({type: EDIT_CONTACT_SUCCESS})
      history.push(generateUrl(CONTACTS_ROUTE))
    },
    failure: () => {
      dispatch({type: EDIT_CONTACT_FAILURE})
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
    editingContact: false,
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
  contact: null,
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
  [GET_CONTACT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      contact: true,
    },
  }),
  [GET_CONTACT_SUCCESS]: (state, {contact}) => ({
    contact,
    loading: {
      ...state.loading,
      contact: false,
    },
  }),
  [GET_CONTACT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      contact: false,
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
  [EDIT_CONTACT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      editingContact: true,
    },
  }),
  [EDIT_CONTACT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      editingContact: false,
    },
  }),
  [EDIT_CONTACT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      editingContact: false,
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
