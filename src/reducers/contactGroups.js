import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'
import { generateUrl } from '../router';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONTACT_GROUPS_REQUEST = 'ContactGroups.GET_CONTACT_GROUPS_REQUEST'
export const GET_CONTACT_GROUPS_SUCCESS = 'ContactGroups.GET_CONTACT_GROUPS_SUCCESS'
export const GET_CONTACT_GROUPS_FAILURE = 'ContactGroups.GET_CONTACT_GROUPS_FAILURE'

export const REMOVE_CONTACT_GROUP_REQUEST = 'ContactGroups.REMOVE_CONTACT_GROUP_REQUEST'
export const REMOVE_CONTACT_GROUP_SUCCESS = 'ContactGroups.REMOVE_CONTACT_GROUP_SUCCESS'
export const REMOVE_CONTACT_GROUP_FAILURE = 'ContactGroups.REMOVE_CONTACT_GROUP_FAILURE'

export const CHANGE_NEW_CONTACT_GROUP = 'ContactGroups.CHANGE_NEW_CONTACT_GROUP'

export const CLEAR = 'ContactGroups.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getContactGroups = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACT_GROUPS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize} = getState().contactGroups
  
  return fetch(`/contact-groups?${qs.stringify({
    page: params && params.pagination && params.pagination.current || page,
    per_page: params && params.pagination && params.pagination.pageSize ||pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_CONTACT_GROUPS_SUCCESS, res}),
    failure: () => dispatch({type: GET_CONTACT_GROUPS_FAILURE}),
  })
}

export const removeContactGroup = (group) => (dispatch, getState, {fetch,history}) => {
  dispatch({type: REMOVE_CONTACT_GROUP_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contact-groups/${group.id}`, {
    method: 'DELETE',
    token,
    success: (res) => {
      dispatch({type: REMOVE_CONTACT_GROUP_SUCCESS})
      dispatch(getContactGroups())
      history.push('/dashboard/contacts/groups')
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
  loading: false,
  contactGroups: [],
  contactGroupsCount: 0,
  page: 1,
  pageSize: 10,
  newContactGroup: '',
}

export default createReducer(initialState, {
  [GET_CONTACT_GROUPS_REQUEST]: (state, {params}) => ({
    page: params.page || 1,
    pageSize: params.pageSize || state.pageSize,
    loading: true,
  }),
  [GET_CONTACT_GROUPS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    contactGroups: data,
    contactGroupsCount: total,
    loading: false,
    newContactGroup: '',
  }),
  [GET_CONTACT_GROUPS_FAILURE]: (state, action) => ({
    loading: false,
  }),
  [CHANGE_NEW_CONTACT_GROUP]: (state, {newContactGroup}) => ({
    newContactGroup,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
