import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {message} from 'antd'
import has from 'lodash/has'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONTACTS_REQUEST = 'ContactGroup.GET_CONTACTS_REQUEST'
export const GET_CONTACTS_SUCCESS = 'ContactGroup.GET_CONTACTS_SUCCESS'
export const GET_CONTACTS_FAILURE = 'ContactGroup.GET_CONTACTS_FAILURE'

export const GET_GROUP_CONTACTS_REQUEST = 'ContactGroup.GET_GROUP_CONTACTS_REQUEST'
export const GET_GROUP_CONTACTS_SUCCESS = 'ContactGroup.GET_GROUP_CONTACTS_SUCCESS'
export const GET_GROUP_CONTACTS_FAILURE = 'ContactGroup.GET_GROUP_CONTACTS_FAILURE'

export const ADD_CONTACT_GROUP_REQUEST = 'ContactGroups.ADD_CONTACT_GROUP_REQUEST'
export const ADD_CONTACT_GROUP_SUCCESS = 'ContactGroups.ADD_CONTACT_GROUP_SUCCESS'
export const ADD_CONTACT_GROUP_FAILURE = 'ContactGroups.ADD_CONTACT_GROUP_FAILURE'

export const EDIT_CONTACT_GROUP_REQUEST = 'ContactGroup.EDIT_CONTACT_GROUP_REQUEST'
export const EDIT_CONTACT_GROUP_SUCCESS = 'ContactGroup.EDIT_CONTACT_GROUP_SUCCESS'
export const EDIT_CONTACT_GROUP_FAILURE = 'ContactGroup.EDIT_CONTACT_GROUP_FAILURE'

export const CHANGE_SELECTED_CONTACTS = 'ContactGroups.CHANGE_SELECTED_CONTACTS'

export const CLEAR = 'ContactGroup.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getContacts = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACTS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize} = getState().contactGroup

  return fetch(`/view-contacts?${qs.stringify({
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_CONTACTS_SUCCESS, res}),
    failure: () => dispatch({type: GET_CONTACTS_FAILURE}),
  })
}

export const getGroupContacts = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_GROUP_CONTACTS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {title} = getState().contactGroup
  return fetch(`/contacts-by-group?${qs.stringify({
    title,
    take: 1000,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_GROUP_CONTACTS_SUCCESS, groupContacts: res.data}),
    failure: () => dispatch({type: GET_GROUP_CONTACTS_FAILURE}),
  })
}

export const addContactGroup = (values) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: ADD_CONTACT_GROUP_REQUEST})
  const {token} = dispatch(getToken())
  const {user} = getState().user
  const {groupContacts} = getState().contactGroup
  return fetch(`/contact-groups`, {
    method: 'POST',
    token,
    body: {
      ...values,
      user_id: user.id,
      // TODO send groupContacts
    },
    success: () => {
      dispatch({type: ADD_CONTACT_GROUP_SUCCESS})
      history.push('/dashboard/contacts/groups')
    },
    failure: () => dispatch({type: ADD_CONTACT_GROUP_FAILURE}),
  })
}

export const editContactGroup = (values) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: EDIT_CONTACT_GROUP_REQUEST})
  const {token} = dispatch(getToken())
  const {groupId, groupContacts} = getState().contactGroup
  return fetch(`/contact-groups/${groupId}`, {
    method: 'PUT',
    body: {
      ...values,
      // TODO send groupContacts
    },
    token,
    success: () => {
      dispatch({type: EDIT_CONTACT_GROUP_SUCCESS})
      message.success('Group updated.')
      history.push('/dashboard/contacts/groups')
    },
    failure: () => {
      dispatch({type: EDIT_CONTACT_GROUP_FAILURE})
      message.error('Something went wrong. Please try again.')
    }
  })
}

export const changeSelectedContacts = (groupContacts) => ({type: CHANGE_SELECTED_CONTACTS, groupContacts})

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    groupContacts: false,
    editingContactGroup: false,
  },
  contacts: [],
  contactsCount: 0,
  groupContacts: [],
  groupContactsCount: 0,
  page: 1,
  pageSize: 12,
  title: null,
  groupId: null,
}

export default createReducer(initialState, {
  [GET_CONTACTS_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : 12,
  }),
  [GET_CONTACTS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    contacts: data,
    contactsCount: total,
  }),
  [GET_GROUP_CONTACTS_REQUEST]: (state, {params}) => ({
    title: has(params, 'title') ? params.title : state.title,
    groupId: has(params, 'groupId') ? params.groupId : state.groupId,
    loading: {
      ...state.loading,
      groupContacts: true,
    },
  }),
  [GET_GROUP_CONTACTS_SUCCESS]: (state, {groupContacts}) => ({
    groupContacts,
    loading: {
      ...state.loading,
      groupContacts: false,
    },
  }),
  [GET_GROUP_CONTACTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      groupContacts: false,
    },
  }),
  [EDIT_CONTACT_GROUP_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      editingContactGroup: true,
    },
  }),
  [EDIT_CONTACT_GROUP_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      editingContactGroup: false,
    },
  }),
  [EDIT_CONTACT_GROUP_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      editingContactGroup: false,
    },
  }),
  [CHANGE_SELECTED_CONTACTS]: (state, {groupContacts}) => ({
    groupContacts,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
