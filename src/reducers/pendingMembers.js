import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_PENDING_TEAM_REQUEST = 'Team.GET_PENDING_TEAM_REQUEST'
export const GET_PENDING_TEAM_SUCCESS = 'Team.GET_PENDING_TEAM_SUCCESS'
export const GET_PENDING_TEAM_FAILURE = 'Team.GET_PENDING_TEAM_FAILURE'

export const EDIT_PENDING_TEAM_MEMBER_ROLE_REQUEST = 'Team.EDIT_PENDING_TEAM_MEMBER_ROLE_REQUEST'
export const EDIT_PENDING_TEAM_MEMBER_ROLE_SUCCESS = 'Team.EDIT_PENDING_TEAM_MEMBER_ROLE_SUCCESS'
export const EDIT_PENDING_TEAM_MEMBER_ROLE_FAILURE = 'Team.EDIT_PENDING_TEAM_MEMBER_ROLE_FAILURE'

export const CLEAR = 'Team.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getPendingTeam = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_PENDING_TEAM_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize} = getState().team
  return fetch(`/invitations?filter_key=accepted&filter_value=0&${qs.stringify({
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_PENDING_TEAM_SUCCESS, res})
    },
    failure: () => dispatch({type: GET_PENDING_TEAM_FAILURE}),
  })
}

export const updatePendingTeamMemberRole = (id, roles) => (dispatch, getState, {fetch}) => {
  dispatch({type: EDIT_PENDING_TEAM_MEMBER_ROLE_REQUEST})
  const {token} = dispatch(getToken())
  
  return fetch(`/invitations/${id}`, {
    method: 'POST',
    token,
    contentType: 'multipart/form-data',
    body: {
      roles,
      _method:'PUT'
    },
    success: (res) => {
      dispatch({type: EDIT_PENDING_TEAM_MEMBER_ROLE_SUCCESS})
      dispatch(getPendingTeam())
    },
    failure: (err) => {
      dispatch({type: EDIT_PENDING_TEAM_MEMBER_ROLE_FAILURE})
    },
  })
  
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  team: [],
  teamCount: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

export default createReducer(initialState, {
  [GET_PENDING_TEAM_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : DEFAULT_PAGE_SIZE,
    loading: true,
  }),
  [GET_PENDING_TEAM_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    team: data,
    teamCount: total,
    loading: false,
  }),
  [GET_PENDING_TEAM_FAILURE]: (state, action) => ({
    loading: false,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
