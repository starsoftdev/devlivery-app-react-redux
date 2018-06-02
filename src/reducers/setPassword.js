import createReducer, {RESET_STORE} from '../createReducer'
import {generateUrl} from '../router'
import {LOGIN_ROUTE} from '../routes'
import {message} from 'antd'
import {getErrorMessage, getSuccessMessage} from '../utils'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PASSWORD_REQUEST = 'SetPassword.SET_PASSWORD_REQUEST'
export const SET_PASSWORD_SUCCESS = 'SetPassword.SET_PASSWORD_SUCCESS'
export const SET_PASSWORD_FAILURE = 'SetPassword.SET_PASSWORD_FAILURE'

export const CLEAR = 'SetPassword.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const setPassword = (values) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: SET_PASSWORD_REQUEST})
  return fetch(`/password/reset`, {
    method: 'POST',
    body: values,
    success: (res) => {
      dispatch({type: SET_PASSWORD_SUCCESS})
      history.push(generateUrl(LOGIN_ROUTE))
      const successMessage = getSuccessMessage(res)
      if (successMessage) message.success(successMessage)
    },
    failure: (res) => dispatch({type: SET_PASSWORD_FAILURE, error: getErrorMessage(res)}),
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
  [SET_PASSWORD_REQUEST]: (state, action) => ({
    loading: true,
    error: null,
  }),
  [SET_PASSWORD_SUCCESS]: (state, action) => ({
    loading: false,
  }),
  [SET_PASSWORD_FAILURE]: (state, {error}) => ({
    loading: false,
    error,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
