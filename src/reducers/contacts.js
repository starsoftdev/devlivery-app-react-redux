import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONTACT_GROUPS_REQUEST = 'Contacts.GET_CONTACT_GROUPS_REQUEST'
export const GET_CONTACT_GROUPS_SUCCESS = 'Contacts.GET_CONTACT_GROUPS_SUCCESS'
export const GET_CONTACT_GROUPS_FAILURE = 'Contacts.GET_CONTACT_GROUPS_FAILURE'

export const ADD_CONTACT_GROUP_REQUEST = 'Contacts.ADD_CONTACT_GROUP_REQUEST'
export const ADD_CONTACT_GROUP_SUCCESS = 'Contacts.ADD_CONTACT_GROUP_SUCCESS'
export const ADD_CONTACT_GROUP_FAILURE = 'Contacts.ADD_CONTACT_GROUP_FAILURE'

export const REMOVE_CONTACT_GROUP_REQUEST = 'Contacts.REMOVE_CONTACT_GROUP_REQUEST'
export const REMOVE_CONTACT_GROUP_SUCCESS = 'Contacts.REMOVE_CONTACT_GROUP_SUCCESS'
export const REMOVE_CONTACT_GROUP_FAILURE = 'Contacts.REMOVE_CONTACT_GROUP_FAILURE'

export const CHANGE_NEW_CONTACT_GROUP = 'Contacts.CHANGE_NEW_CONTACT_GROUP'

export const CLEAR = 'Orders.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getContactGroups = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACT_GROUPS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search, ordering, page, pageSize} = getState().contacts
  return fetch(`/contact-groups?${qs.stringify({
    search,
    ordering,
    page,
    page_size: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_CONTACT_GROUPS_SUCCESS, res}),
    failure: () => dispatch({type: GET_CONTACT_GROUPS_FAILURE}),
  })
}

export const addContactGroup = () => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_CONTACT_GROUP_REQUEST})
  const {token} = dispatch(getToken())
  const {newContactGroup} = getState().contacts
  const {user} = getState().user
  return fetch(`/contact-groups`, {
    method: 'POST',
    token,
    body: {
      title: newContactGroup,
      user_id: user.id,
    },
    success: () => {
      dispatch({type: ADD_CONTACT_GROUP_SUCCESS})
      dispatch(getContactGroups())
    },
    failure: () => dispatch({type: ADD_CONTACT_GROUP_FAILURE}),
  })
}

export const removeContactGroup = (group) => (dispatch, getState, {fetch}) => {
  dispatch({type: REMOVE_CONTACT_GROUP_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contact-groups/${group.id}`, {
    method: 'DELETE',
    token,
    success: () => {
      dispatch({type: REMOVE_CONTACT_GROUP_SUCCESS})
      dispatch(getContactGroups())
    },
    failure: () => dispatch({type: REMOVE_CONTACT_GROUP_FAILURE}),
  })
}

export const changeNewContactGroup = (newContactGroup) => ({type: CHANGE_NEW_CONTACT_GROUP, newContactGroup})

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    contactGroups: false,
  },
  contactGroups: [],
  contactGroupsCount: 0,
  page: 1,
  pageSize: 20,
  newContactGroup: '',
}

export default createReducer(initialState, {
  [GET_CONTACT_GROUPS_REQUEST]: (state, {params}) => ({
    // TODO add params
    loading: {
      ...state.loading,
      contactGroups: true,
    },
  }),
  [GET_CONTACT_GROUPS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    contactGroups: data,
    contactGroupsCount: total,
    loading: {
      ...state.loading,
      contactGroups: false,
    },
  }),
  [GET_CONTACT_GROUPS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      contactGroups: false,
    },
  }),
  [CHANGE_NEW_CONTACT_GROUP]: (state, {newContactGroup}) => ({
    newContactGroup,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
