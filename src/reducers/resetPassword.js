import createReducer, {RESET_STORE} from '../createReducer'
import {getErrorMessage, getSuccessMessage} from '../utils'

// ------------------------------------
// Constants
// ------------------------------------
export const RESET_PASSWORD_REQUEST = 'ResetPassword.REQUEST'
export const RESET_PASSWORD_SUCCESS = 'ResetPassword.SUCCESS'
export const RESET_PASSWORD_FAILURE = 'ResetPassword.FAILURE'

export const CLEAR = 'ResetPassword.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const resetPassword = (values, form) => (dispatch, getState, {fetch}) => {
  dispatch({type: RESET_PASSWORD_REQUEST})
  return fetch(`/password/email`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      email: values.email,
    },
    success: (res) => {
      dispatch({type: RESET_PASSWORD_SUCCESS, success: getSuccessMessage(res)})
      form.resetFields()
    },
    failure: (res) => dispatch({type: RESET_PASSWORD_FAILURE, error: getErrorMessage(res)}),
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  success: null,
  error: null,
}

export default createReducer(initialState, {
  [RESET_PASSWORD_REQUEST]: (state, action) => ({
    loading: true,
    error: null,
    success: null,
  }),
  [RESET_PASSWORD_SUCCESS]: (state, {success}) => ({
    loading: false,
    success,
  }),
  [RESET_PASSWORD_FAILURE]: (state, {error}) => ({
    loading: false,
    error,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
