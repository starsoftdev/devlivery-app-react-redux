import createReducer, {RESET_STORE} from '../createReducer'
import {generateUrl} from '../router'
import {LOGIN_ROUTE} from '../routes'

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
  return fetch(`/user/set-password/`, {
    method: 'POST',
    body: values,
    success: () => {
      dispatch({type: SET_PASSWORD_SUCCESS})
      history.push(generateUrl(LOGIN_ROUTE))
      // TODO add notifications
      // message.success('')
    },
    failure: () => dispatch({type: SET_PASSWORD_FAILURE, error: ''}),
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
