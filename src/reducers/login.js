import createReducer, {RESET_STORE} from '../createReducer'
import {getUserSuccess} from './user'
import {DAY, TOKEN_COOKIE, YEAR} from '../constants'
import {getErrorMessage} from '../utils'
import {message} from 'antd'
// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_REQUEST = 'Login.LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'Login.LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'Login.LOGIN_FAILURE'

export const CLEAR = 'Login.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const login = (values, redirectUrl = '/') => (dispatch, getState, {fetch}) => {
  dispatch({type: LOGIN_REQUEST})
  return fetch(`/login`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      email: values.email,
      password: values.password,
    },
    success: ({data}) => dispatch(loginSuccess(data, redirectUrl)),
    failure: (res) => dispatch({type: LOGIN_FAILURE, error: getErrorMessage(res)})
  })
}

export const loginSuccess = (auth, redirectUrl) => (dispatch, getState, {history, cookies}) => {
  dispatch({type: LOGIN_SUCCESS})
  cookies.set(TOKEN_COOKIE, auth.accessToken, {maxAge: DAY, path: '/'})
  dispatch(getUserSuccess(auth.user))
  if (process.env.BROWSER && redirectUrl) {
    history.push(redirectUrl)
  }
}
export const resendVerify = (id, redirectUrl = '/') => (dispatch, getState, {fetch}) => {
  return fetch(`/account/resend-activation-email`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      user_id: id,
    },
    success: ({data}) => {
      message.success(data)
    },
    failure: (res) => {
      message.error(res)
    }
  })
}
export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  error: null,
}

export default createReducer(initialState, {
  [LOGIN_REQUEST]: (state, action) => ({
    loading: true,
    error: null,
  }),
  [LOGIN_SUCCESS]: (state, action) => ({
    loading: false,
    error: null,
  }),
  [LOGIN_FAILURE]: (state, {error}) => ({
    loading: false,
    error,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
