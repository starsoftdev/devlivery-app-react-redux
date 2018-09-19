import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'
import {
  ADD_CONTACT_GROUP_FAILURE,
  ADD_CONTACT_GROUP_REQUEST,
  ADD_CONTACT_GROUP_SUCCESS,
  getContactGroups
} from "./contactGroups";

// ------------------------------------
// Constants
// ------------------------------------
export const GET_ROLE_GROUP_REQUEST = 'Permission.GET_ROLE_GROUP_REQUEST'
export const GET_ROLE_GROUP_SUCCESS = 'Permission.GET_ROLE_GROUP_SUCCESS'
export const GET_ROLE_GROUP_FAILURE = 'Permission.GET_ROLE_GROUP_FAILURE'

export const CHANGE_NEW_ROLE_GROUP = 'Permission.CHANGE_NEW_ROLE_GROUP'

export const ADD_ROLE_GROUP_REQUEST = 'Permission.ADD_ROLE_GROUP_REQUEST'
export const ADD_ROLE_GROUP_SUCCESS = 'Permission.ADD_ROLE_GROUP_SUCCESS'
export const ADD_ROLE_GROUP_FAILURE = 'Permission.ADD_ROLE_GROUP_FAILURE'

export const GET_PERMISSIONS_REQUEST = 'Permission.GET_PERMISSIONS_REQUEST'
export const GET_PERMISSIONS_SUCCESS = 'Permission.GET_PERMISSIONS_SUCCESS'
export const GET_PERMISSIONS_FAILURE = 'Permission.GET_PERMISSIONS_FAILURE'

export const GET_PERMISSIONS_SPECIALROLE_SUCCESS = 'Permission.GET_PERMISSIONS_SPECIALROLE_SUCCESS'

export const SET_PERMISSIONS_REQUEST = 'Permission.SET_PERMISSIONS_REQUEST'
export const SET_PERMISSIONS_SUCCESS = 'Permission.SET_PERMISSIONS_SUCCESS'
export const SET_PERMISSIONS_FAILURE = 'Permission.SET_PERMISSIONS_FAILURE'

export const DELETE_ROLE_GROUP_REQUEST = 'Permission.DELETE_ROLE_GROUP_REQUEST'
export const DELETE_ROLE_GROUP_SUCCESS = 'Permission.DELETE_ROLE_GROUP_SUCCESS'
export const DELETE_ROLE_GROUP_FAILURE = 'Permission.DELETE_ROLE_GROUP_FAILURE'

export const GET_USER_PERMISSIONS_REQUEST = 'Permission.GET_USER_PERMISSIONS_REQUEST'
export const GET_USER_PERMISSIONS_SUCCESS = 'Permission.GET_USER_PERMISSIONS_SUCCESS'
export const GET_USER_PERMISSIONS_FAILURE = 'Permission.GET_USER_PERMISSIONS_FAILURE'

export const GET_ANY_PERMISSIONS_REQUEST = 'Permission.GET_USER_PERMISSIONS_REQUEST'
export const GET_ANY_PERMISSIONS_SUCCESS = 'Permission.GET_USER_PERMISSIONS_SUCCESS'
export const GET_ANY_PERMISSIONS_FAILURE = 'Permission.GET_USER_PERMISSIONS_FAILURE'

export const CLEAR = 'Team.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getRole = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_ROLE_GROUP_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize} = getState().permission
  return fetch(`/user-roles?${qs.stringify({
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_ROLE_GROUP_SUCCESS, res})
    },
    failure: () => dispatch({type: GET_ROLE_GROUP_FAILURE}),
  })
}
export const getTeamRole = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_ROLE_GROUP_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize} = getState().permission
  return fetch(`/team-roles?${qs.stringify({
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_ROLE_GROUP_SUCCESS, res})
    },
    failure: () => dispatch({type: GET_ROLE_GROUP_FAILURE}),
  })
}
export const getUserPermission = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  return fetch(`/user-permissions`, {
    method: 'GET',
    token,
    success: (res) => {
      console.log('/user-permissions',res);
      dispatch({type: GET_USER_PERMISSIONS_SUCCESS, res})
    },
    failure: () => dispatch({type: GET_USER_PERMISSIONS_FAILURE}),
  })
}
export const hasAnyPermission = (permissions) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  console.log('/has-any-permission',{
    permissions,
  });
  return fetch(`/has-any-permission`, {
    method: 'POST',
    contentType: 'application/json',
    token,
    body: {
      permissions,
    },
    success: (res) => {
      console.log('/has-any-permission',res);
      dispatch({type: GET_ANY_PERMISSIONS_SUCCESS, res})
    },
    failure: (err) => {
      console.log('/has-any-permission',err);
      dispatch({type: GET_ANY_PERMISSIONS_FAILURE})
    },
  })
}
export const getPermissions = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_PERMISSIONS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize} = getState().permission
  return fetch(`/permissions?${qs.stringify({
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_PERMISSIONS_SUCCESS, res}),
    failure: () => dispatch({type: GET_PERMISSIONS_FAILURE}),
  })
}

export const addGroup = () => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_ROLE_GROUP_REQUEST})
  const {token} = dispatch(getToken())
  const {newRoleGroup} = getState().permission
  return fetch(`/role/add`, {
    method: 'POST',
    token,
    body: {
      name: newRoleGroup,
    },
    success: () => {
      dispatch({type: ADD_ROLE_GROUP_SUCCESS})
      dispatch(getRole())
    },
    failure: () => dispatch({type: ADD_ROLE_GROUP_FAILURE}),
  })
}

export const removeGroup = (id) => (dispatch, getState, {fetch}) => {
  dispatch({type: DELETE_ROLE_GROUP_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/role/remove/${id}`, {
    method: 'POST',
    token,
    success: () => {
      dispatch({type: DELETE_ROLE_GROUP_SUCCESS})
      dispatch(getRole())
    },
    failure: () => dispatch({type: DELETE_ROLE_GROUP_FAILURE}),
  })
}

export const setPermissions = (role_id, pickedPermissions) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: SET_PERMISSIONS_REQUEST})
  return fetch(`/role/permissions/sync`, {
    method: 'POST',
    token,
    body: {
      role_id,
      permissions: pickedPermissions,
    },
    success: () => {
      dispatch({type: SET_PERMISSIONS_SUCCESS})
      dispatch(getContactGroups())
    },
    failure: (err) => {
      dispatch({type: SET_PERMISSIONS_FAILURE})
    },
  })
}
export const getPermissionsOfSpecialRole = (role_id) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  
  return fetch(`/role/permissions`, {
    method: 'POST',
    token,
    body: {
      role_id,
    },
    success: (res) => {
      dispatch({type: GET_PERMISSIONS_SPECIALROLE_SUCCESS,res:{id: role_id, data:res.data}});
    },
    failure: (err) => {
      
    },
  })
}
export const changeNewRoleGroup = (newRoleGroup) => ({type: CHANGE_NEW_ROLE_GROUP, newRoleGroup})

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    groups: false,
    permissions: false,
    removingGroup: false,
    settingPermissions: false,
  },
  groups: [],
  permissions: [],
  pickedPermissions: [],
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  newRoleGroup: '',
}

export default createReducer(initialState, {
  [GET_PERMISSIONS_SPECIALROLE_SUCCESS]: (state, action) => ({
    specialPermissions: action.res,
  }),
  [GET_ROLE_GROUP_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : DEFAULT_PAGE_SIZE,
    loading: {
      ...state.loading,
      groups: true,
    },
  }),
  [GET_ROLE_GROUP_SUCCESS]: (state, action) => ({
    groups: action.res.data,
    loading: {
      ...state.loading,
      groups: false,
    },
  }),
  [GET_ROLE_GROUP_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      groups: false,
    },
  }),
  [GET_USER_PERMISSIONS_SUCCESS]: (state, action) => ({
    user_permissions: action.res.data,
    loading: {
      ...state.loading,
      user_permissions: false,
    },
  }),
  [GET_USER_PERMISSIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      user_permissions: false,
    },
  }),
  [GET_PERMISSIONS_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : DEFAULT_PAGE_SIZE,
    loading: {
      ...state.loading,
      permissions: true,
    },
  }),
  [GET_PERMISSIONS_SUCCESS]: (state, action) => ({
    permissions: action.res,
    loading: {
      ...state.loading,
      permissions: false,
    },
  }),
  [GET_PERMISSIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      permissions: false,
    },
  }),
  [GET_PERMISSIONS_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : DEFAULT_PAGE_SIZE,
    loading: {
      ...state.loading,
      permissions: true,
    },
  }),
  [GET_PERMISSIONS_SUCCESS]: (state, action) => ({
    permissions: action.res.data,
    loading: {
      ...state.loading,
      permissions: false,
    },
  }),
  [GET_PERMISSIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      permissions: false,
    },
  }),

  [CHANGE_NEW_ROLE_GROUP]: (state, {newRoleGroup}) => ({
    newRoleGroup,
  }),
  [ADD_ROLE_GROUP_SUCCESS]: (state, action) => ({
    newRoleGroup: '',
  }),
  [DELETE_ROLE_GROUP_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      removingGroup: true,
    },
  }),
  [DELETE_ROLE_GROUP_SUCCESS]: (state, {groupContacts}) => ({
    loading: {
      ...state.loading,
      removingGroup: false,
    },
  }),
  [DELETE_ROLE_GROUP_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      removingGroup: false,
    },
  }),
  [SET_PERMISSIONS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      settingPermissions: true,
    },
  }),
  [SET_PERMISSIONS_SUCCESS]: (state, {groupContacts}) => ({
    groupContacts,
    loading: {
      ...state.loading,
      settingPermissions: false,
    },
  }),
  [SET_PERMISSIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      settingPermissions: false,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
