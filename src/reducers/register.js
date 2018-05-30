import createReducer, {RESET_STORE} from '../createReducer'
import {message} from 'antd'

// ------------------------------------
// Constants
// ------------------------------------
export const REGISTER_REQUEST = 'Register.REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'Register.REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'Register.REGISTER_FAILURE'

export const CLEAR = 'Register.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const register = (values) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: REGISTER_REQUEST})
  return fetch(`/user/activate/`, {
    method: 'POST',
    body: values,
    success: () => {
      dispatch({type: REGISTER_SUCCESS})
      // message.success('')
      // TODO use route name
      history.replace('/login')
    },
    failure: () => {
      dispatch({type: REGISTER_FAILURE, error: 'Something went wrong. Please try again.'})
    },
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
  [REGISTER_REQUEST]: (state, action) => ({
    loading: true,
    error: null,
  }),
  [REGISTER_SUCCESS]: (state, action) => ({
    loading: false,
  }),
  [REGISTER_FAILURE]: (state, {error}) => ({
    loading: false,
    error,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
