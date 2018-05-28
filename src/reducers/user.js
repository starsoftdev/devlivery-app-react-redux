import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {PREV_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, TOKEN_COOKIE} from '../constants'
import {getFormErrors} from '../utils'

// ------------------------------------
// Constants
// ------------------------------------
export const LOGOUT_REQUEST = 'User.LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'User.LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'User.LOGOUT_FAILURE'

export const GET_USER_REQUEST = 'User.GET_USER_REQUEST'
export const GET_USER_SUCCESS = 'User.GET_USER_SUCCESS'
export const GET_USER_FAILURE = 'User.GET_USER_FAILURE'

export const REFRESH_TOKEN_REQUEST = 'User.REFRESH_TOKEN_REQUEST'
export const REFRESH_TOKEN_SUCCESS = 'User.REFRESH_TOKEN_SUCCESS'
export const REFRESH_TOKEN_FAILURE = 'User.REFRESH_TOKEN_FAILURE'

export const UPDATE_USER_REQUEST = 'User.UPDATE_USER_REQUEST'
export const UPDATE_USER_SUCCESS = 'User.UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILURE = 'User.UPDATE_USER_FAILURE'

export const UPDATE_PASSWORD_REQUEST = 'User.UPDATE_PASSWORD_REQUEST'
export const UPDATE_PASSWORD_SUCCESS = 'User.UPDATE_PASSWORD_SUCCESS'
export const UPDATE_PASSWORD_FAILURE = 'User.UPDATE_PASSWORD_FAILURE'

let refreshingToken = false

// ------------------------------------
// Actions
// ------------------------------------
export const expireToken = () => (dispatch, getState, {cookies}) => {
  cookies.remove(TOKEN_COOKIE, {path: ''})
  cookies.remove(REFRESH_TOKEN_COOKIE, {path: ''})
  cookies.remove(PREV_TOKEN_COOKIE, {path: ''})
}

export const logoutSuccess = () => (dispatch) => {
  dispatch(expireToken())
  dispatch({type: LOGOUT_SUCCESS})
}

export const refreshToken = (token, refresh_token) => (dispatch, getState, {fetch, history}) => {
  if (refreshingToken) {
    return
  }
  refreshingToken = true
  dispatch({type: REFRESH_TOKEN_REQUEST})
  const {clientId, clientSecret, currentPathname} = getState().global
  return fetch(`/auth/token/`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token,
    },
    success: (res) => {
      dispatch(loginSuccess(res, true, currentPathname))
      dispatch({type: REFRESH_TOKEN_SUCCESS})
    },
    failure: (err) => {
      dispatch(logoutSuccess())
      dispatch({type: REFRESH_TOKEN_FAILURE})
      if (process.env.BROWSER) {
        // refresh page to resend requests
        history.replace(currentPathname)
      }
    }
  })
}

export const getToken = () => (dispatch, getState, {history, cookies}) => {
  const {currentPathname} = getState().global
  const {loggedIn} = getState().user
  const token = cookies.get(TOKEN_COOKIE)
  const refresh_token = cookies.get(REFRESH_TOKEN_COOKIE)
  const prevToken = cookies.get(PREV_TOKEN_COOKIE)
  if (!token) {
    if (prevToken && refresh_token) {
      dispatch(refreshToken(prevToken, refresh_token))
    } else if (loggedIn) {
      dispatch(logoutSuccess())
      if (process.env.BROWSER) {
        // refresh page to resend requests
        history.replace(currentPathname)
      }
    }
    return {}
  }
  return {token, refresh_token}
}

export const logout = (redirectUrl) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: LOGOUT_REQUEST})
  return fetch(`/logout`, {
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    token,
    success: (res) => dispatch(logoutSuccess(res)),
    failure: (err) => dispatch({type: LOGOUT_FAILURE, err})
  })
}

export const getUser = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {user} = getState().user
  if (!user && token) {
    dispatch({type: GET_USER_REQUEST})
    return fetch(`/user/me/`, {
      method: 'GET',
      token,
      success: (user) => dispatch({type: GET_USER_SUCCESS, user}),
      failure: () => dispatch({type: GET_USER_FAILURE})
    })
  } else {
    return user
  }
}

export const updateUser = (values) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: UPDATE_USER_REQUEST})
  return fetch(`/user/me/`, {
    method: 'PATCH',
    token,
    body: values,
    success: (user) => {
      dispatch({type: UPDATE_USER_SUCCESS, user})
      // TODO add notification
    },
    failure: () => {
      dispatch({type: UPDATE_USER_FAILURE})
      // TODO add notification
    }
  })
}

export const updatePassword = (values) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: UPDATE_PASSWORD_REQUEST})
  return fetch(`/user/me/change-password/`, {
    method: 'PATCH',
    token,
    body: values,
    success: () => {
      dispatch({type: UPDATE_PASSWORD_SUCCESS})
      // TODO add notification
    },
    failure: (errors) => {
      const {error} = getFormErrors({errors, values})
      dispatch({type: UPDATE_PASSWORD_FAILURE, error})
    }
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    updatingUser: false,
    updatingPassword: false,
  },
  loggedIn: false,
  error: null,
  user: null,
  refreshingToken: false,
  role: null,
  customer: null,
}

export default createReducer(initialState, {
  [LOGOUT_SUCCESS]: (state, action) => RESET_STORE,
  [GET_USER_SUCCESS]: (state, {user, role}) => ({
    user,
    role: user.role,
    customer: user.customer,
    loggedIn: true,
  }),
  [REFRESH_TOKEN_REQUEST]: (state, action) => ({
    refreshingToken: true,
  }),
  [REFRESH_TOKEN_SUCCESS]: (state, action) => ({
    refreshingToken: false,
  }),
  [REFRESH_TOKEN_FAILURE]: (state, action) => ({
    refreshingToken: false,
  }),
  [UPDATE_USER_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingUser: true,
    }
  }),
  [UPDATE_USER_SUCCESS]: (state, {user}) => ({
    user,
    role: user.role,
    customer: user.customer,
    loading: {
      ...state.loading,
      updatingUser: false,
    }
  }),
  [UPDATE_USER_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingUser: false,
    }
  }),
  [UPDATE_PASSWORD_REQUEST]: (state, action) => ({
    error: null,
    loading: {
      ...state.loading,
      updatingPassword: true,
    }
  }),
  [UPDATE_PASSWORD_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingPassword: false,
    }
  }),
  [UPDATE_PASSWORD_FAILURE]: (state, {error}) => ({
    error,
    loading: {
      ...state.loading,
      updatingPassword: false,
    }
  }),
})
