import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {message} from 'antd'
import {getBirthday} from '../utils'
import {getToken} from './user'

// ------------------------------------
// Constants
// ------------------------------------
export const INDIVIDUAL_ACCOUNT = 'individual'
export const TEAM_ACCOUNT = 'team'

export const REGISTER_REQUEST = 'Register.REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'Register.REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'Register.REGISTER_FAILURE'

export const SET_ACCOUNT_TYPE = 'Register.SET_ACCOUNT_TYPE'

export const GET_ROLES_REQUEST = 'Register.GET_ROLES_REQUEST'
export const GET_ROLES_SUCCESS = 'Register.GET_ROLES_SUCCESS'
export const GET_ROLES_FAILURE = 'Register.GET_ROLES_FAILURE'

export const ADD_TEAM_REQUEST = 'Register.ADD_TEAM_REQUEST'
export const ADD_TEAM_SUCCESS = 'Register.ADD_TEAM_SUCCESS'
export const ADD_TEAM_FAILURE = 'Register.ADD_TEAM_FAILURE'

export const CLEAR = 'Register.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const register = (values) => (dispatch, getState, {fetch}) => {
  dispatch({type: REGISTER_REQUEST, individualDetails: values})
  const {accountType, individualDetails: {birthday, ...otherDetails}} = getState().register
  return fetch(`/signup`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      ...otherDetails,
      account_type: accountType,
      dob: getBirthday(birthday),
    },
    success: (res) => {
      dispatch({type: REGISTER_SUCCESS})
      dispatch(loginSuccess(res.data))
      history.push(accountType === TEAM_ACCOUNT ? '/register/team-details' : '/dashboard/orders')
    },
    failure: () => {
      dispatch({type: REGISTER_FAILURE})
      message.error('Something went wrong. Please try again.')
    },
  })
}

export const setAccountType = (accountType) => ({type: SET_ACCOUNT_TYPE, accountType})

export const getRoles = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_ROLES_REQUEST})
  return fetch(`/roles`, {
    method: 'GET',
    success: (roles) => {
      dispatch({type: GET_ROLES_SUCCESS, roles})
    },
    failure: () => {
      dispatch({type: GET_ROLES_FAILURE})
    }
  })
}

export const addTeam = (values) => (dispatch, getState, {fetch}) => {
  const {user} = getState().user
  const {token} = dispatch(getToken())
  dispatch({type: ADD_TEAM_REQUEST, teamDetails: values})
  return fetch(`/teams`, {
    method: 'POST',
    body: {
      creator_id: user.id,
      ...values,
    },
    token,
    success: () => {
      dispatch({type: ADD_TEAM_SUCCESS})
      history.push('/register/invite-people')
    },
    failure: () => {
      dispatch({type: ADD_TEAM_FAILURE})
    },
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    register: false,
    roles: false,
    addingTeam: false,
  },
  accountType: null,
  individualDetails: null,
  teamDetails: null,
  roles: [],
}

export default createReducer(initialState, {
  [REGISTER_REQUEST]: (state, {individualDetails}) => ({
    individualDetails,
    loading: {
      ...state.loading,
      register: true,
    },
  }),
  [REGISTER_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      register: false,
    },
  }),
  [REGISTER_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      register: false,
    },
  }),
  [GET_ROLES_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      roles: true,
    },
  }),
  [GET_ROLES_SUCCESS]: (state, {roles}) => ({
    roles,
    loading: {
      ...state.loading,
      roles: false,
    },
  }),
  [GET_ROLES_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      roles: false,
    },
  }),
  [ADD_TEAM_REQUEST]: (state, {teamDetails}) => ({
    teamDetails,
    loading: {
      ...state.loading,
      addingTeam: true,
    },
  }),
  [ADD_TEAM_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      addingTeam: false,
    },
  }),
  [GET_ROLES_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      addingTeam: false,
    },
  }),
  [SET_ACCOUNT_TYPE]: (state, {accountType}) => ({
    accountType,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
