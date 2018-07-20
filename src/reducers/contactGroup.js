import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {message} from 'antd'
import has from 'lodash/has'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_GROUP_CONTACTS_REQUEST = 'ContactGroup.GET_GROUP_CONTACTS_REQUEST'
export const GET_GROUP_CONTACTS_SUCCESS = 'ContactGroup.GET_GROUP_CONTACTS_SUCCESS'
export const GET_GROUP_CONTACTS_FAILURE = 'ContactGroup.GET_GROUP_CONTACTS_FAILURE'

export const EDIT_GROUP_REQUEST = 'ContactGroup.EDIT_GROUP_REQUEST'
export const EDIT_GROUP_SUCCESS = 'ContactGroup.EDIT_GROUP_SUCCESS'
export const EDIT_GROUP_FAILURE = 'ContactGroup.EDIT_GROUP_FAILURE'

export const REMOVE_CONTACT_FROM_GROUP_REQUEST = 'ContactGroup.REMOVE_CONTACT_FROM_GROUP_REQUEST'
export const REMOVE_CONTACT_FROM_GROUP_SUCCESS = 'ContactGroup.REMOVE_CONTACT_FROM_GROUP_SUCCESS'
export const REMOVE_CONTACT_FROM_GROUP_FAILURE = 'ContactGroup.REMOVE_CONTACT_FROM_GROUP_FAILURE'

export const CLEAR = 'ContactGroup.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getGroupContacts = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_GROUP_CONTACTS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {title, page, pageSize} = getState().contactGroup
  return fetch(`/contacts-by-group?${qs.stringify({
    title,
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_GROUP_CONTACTS_SUCCESS, res}),
    failure: () => dispatch({type: GET_GROUP_CONTACTS_FAILURE}),
  })
}

export const editGroup = (values) => (dispatch, getState, {fetch}) => {
  dispatch({type: EDIT_GROUP_REQUEST})
  const {token} = dispatch(getToken())
  const {groupId} = getState().contactGroup
  return fetch(`/contact-groups/${groupId}`, {
    method: 'PUT',
    body: values,
    token,
    success: () => {
      dispatch({type: EDIT_GROUP_SUCCESS})
      message.success('Group updated.')
    },
    failure: () => {
      dispatch({type: EDIT_GROUP_FAILURE})
      message.error('Something went wrong. Please try again.')
    }
  })
}

export const removeContactFromGroup = (contact) => (dispatch, getState, {fetch}) => {
  dispatch({type: REMOVE_CONTACT_FROM_GROUP_REQUEST})
  const {token} = dispatch(getToken())
  const {groupId, groupContacts} = getState().contactGroup
  return fetch(`/contact/${contact.id}/group/${groupId}/detach`, {
    method: 'POST',
    token,
    success: () => {
      dispatch({
        type: REMOVE_CONTACT_FROM_GROUP_SUCCESS,
        groupContacts: groupContacts.filter(item => item.id !== contact.id)
      })
      message.success('Contact removed from group.')
    },
    failure: () => {
      dispatch({type: REMOVE_CONTACT_FROM_GROUP_FAILURE})
      message.error('Something went wrong. Please try again.')
    },
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    groupContacts: false,
    editingGroup: false,
    removingContactFromGroup: false,
  },
  groupContacts: [],
  groupContactsCount: 0,
  page: 1,
  pageSize: 12,
  title: null,
  groupId: null,
}

export default createReducer(initialState, {
  [GET_GROUP_CONTACTS_REQUEST]: (state, {params}) => ({
    title: has(params, 'title') ? params.title : state.title,
    groupId: has(params, 'groupId') ? params.groupId : state.groupId,
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : 12,
    loading: {
      ...state.loading,
      groupContacts: true,
    },
  }),
  [GET_GROUP_CONTACTS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    groupContacts: data,
    groupContactsCount: total,
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
  [EDIT_GROUP_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      editingGroup: true,
    },
  }),
  [EDIT_GROUP_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      editingGroup: false,
    },
  }),
  [EDIT_GROUP_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      editingGroup: false,
    },
  }),
  [REMOVE_CONTACT_FROM_GROUP_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      removingContactFromGroup: true,
    },
  }),
  [REMOVE_CONTACT_FROM_GROUP_SUCCESS]: (state, {groupContacts}) => ({
    groupContacts,
    groupContactsCount: state.groupContactsCount - 1,
    loading: {
      ...state.loading,
      removingContactFromGroup: false,
    },
  }),
  [REMOVE_CONTACT_FROM_GROUP_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      removingContactFromGroup: false,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
