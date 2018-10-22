import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_TEAM_REQUEST = 'Team.GET_TEAM_REQUEST'
export const GET_TEAM_SUCCESS = 'Team.GET_TEAM_SUCCESS'
export const GET_TEAM_FAILURE = 'Team.GET_TEAM_FAILURE'

export const EDIT_TEAM_MEMBER_ROLE_REQUEST = 'Team.EDIT_TEAM_MEMBER_ROLE_REQUEST'
export const EDIT_TEAM_MEMBER_ROLE_SUCCESS = 'Team.EDIT_TEAM_MEMBER_ROLE_SUCCESS'
export const EDIT_TEAM_MEMBER_ROLE_FAILURE = 'Team.EDIT_TEAM_MEMBER_ROLE_FAILURE'

export const ADD_NEW_BUDGET_REQUEST = 'Team.ADD_NEW_BUDGET_REQUEST'
export const ADD_NEW_BUDGET_SUCCESS = 'Team.ADD_NEW_BUDGET_SUCCESS'
export const ADD_NEW_BUDGET_FAILURE = 'Team.ADD_NEW_BUDGET_FAILURE'

export const ADD_AMOUNT_BUDGET_REQUEST = 'Team.ADD_AMOUNT_BUDGET_REQUEST'
export const ADD_AMOUNT_BUDGET_SUCCESS = 'Team.ADD_AMOUNT_BUDGET_SUCCESS'
export const ADD_AMOUNT_BUDGET_FAILURE = 'Team.ADD_AMOUNT_BUDGET_FAILURE'

export const REDUCE_AMOUNT_BUDGET_REQUEST = 'Team.REDUCE_AMOUNT_BUDGET_REQUEST'
export const REDUCE_AMOUNT_BUDGET_SUCCESS = 'Team.REDUCE_AMOUNT_BUDGET_SUCCESS'
export const REDUCE_AMOUNT_BUDGET_FAILURE = 'Team.REDUCE_AMOUNT_BUDGET_FAILURE'

export const DELETE_BUDGET_REQUEST = 'Team.DELETE_BUDGET_REQUEST'
export const DELETE_BUDGET_SUCCESS = 'Team.DELETE_BUDGET_SUCCESS'
export const DELETE_BUDGET_FAILURE = 'Team.DELETE_BUDGET_FAILURE'

export const CLEAR = 'Team.CLEAR'
import { getFormErrors, showErrorMessage } from '../utils'
// ------------------------------------
// Actions
// ------------------------------------
export const getTeam = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_TEAM_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize} = getState().team
  return fetch(`/teams`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_TEAM_SUCCESS, res})
    },
    failure: (err) => {
      dispatch({type: GET_TEAM_FAILURE})
    },
  })
}

export const addBudget = (member_id, budget) => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_NEW_BUDGET_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/budgets/add`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      member_id,
      budget,
    },
    success: (res) => {
      dispatch({type: ADD_NEW_BUDGET_SUCCESS})
      dispatch(getTeam())
    },
    failure: (err) =>{
      dispatch({type: ADD_NEW_BUDGET_FAILURE})
    },
  })
}

export const addAmountBudget = (budget_id, amount) => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_AMOUNT_BUDGET_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/budgets/add-amount`, {
    method: 'POST',
    token,
    body: {
      budget_id,
      amount,
    },
    success: () => {
      dispatch({type: ADD_AMOUNT_BUDGET_SUCCESS})
      dispatch(getTeam())
    },
    failure: () => dispatch({type: ADD_AMOUNT_BUDGET_FAILURE}),
  })
}
export const saveAmountBudget = (budget_id, amount) => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_AMOUNT_BUDGET_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/budgets/set-amount`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      budget_id,
      amount,
    },
    success: () => {
      dispatch({type: ADD_AMOUNT_BUDGET_SUCCESS})
      dispatch(getTeam())
    },
    failure: (err) => {
      showErrorMessage(err);
      dispatch({type: ADD_AMOUNT_BUDGET_FAILURE})
    },
  })
}
export const reduceAmountBudget = (budget_id, amount) => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_AMOUNT_BUDGET_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/budgets/reduce-amount`, {
    method: 'POST',
    token,
    body: {
      budget_id,
      amount,
    },
    success: (res) => {
      dispatch({type: ADD_AMOUNT_BUDGET_SUCCESS})
      dispatch(getTeam())
    },
    failure: () => dispatch({type: ADD_AMOUNT_BUDGET_FAILURE}),
  })
}

export const updateTeamMemberRole = (id, roles) => (dispatch, getState, {fetch}) => {
  dispatch({type: EDIT_TEAM_MEMBER_ROLE_REQUEST})
  const {token} = dispatch(getToken())
  
  return fetch(`/role/assign`, {
    method: 'POST',
    token,
    body: {
      user_id: id,
      role_id: roles,
    },
    success: (res) => {
      dispatch({type: EDIT_TEAM_MEMBER_ROLE_SUCCESS})
      dispatch(getTeam())
    },
    failure: (err) => {
      dispatch({type: EDIT_TEAM_MEMBER_ROLE_FAILURE})
    },
  })
}

export const deleteBudget = (budget_id) => (dispatch, getState, {fetch}) => {
  dispatch({type: DELETE_BUDGET_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/budgets/delete`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      budget_id,
    },
    success: () => {
      dispatch({type: DELETE_BUDGET_SUCCESS})
      dispatch(getTeam())
    },
    failure: () => dispatch({type: DELETE_BUDGET_FAILURE}),
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
  [GET_TEAM_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : DEFAULT_PAGE_SIZE,
    loading: true,
  }),
  [GET_TEAM_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    team: data,
    teamCount: total,
    loading: false,
  }),
  [GET_TEAM_FAILURE]: (state, action) => ({
    loading: false,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
