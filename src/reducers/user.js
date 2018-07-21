import createReducer, {RESET_STORE} from '../createReducer'
import {TOKEN_COOKIE} from '../constants'

// ------------------------------------
// Constants
// ------------------------------------
export const LOGOUT_SUCCESS = 'User.LOGOUT_SUCCESS'

export const GET_USER_REQUEST = 'User.GET_USER_REQUEST'
export const GET_USER_SUCCESS = 'User.GET_USER_SUCCESS'
export const GET_USER_FAILURE = 'User.GET_USER_FAILURE'

export const UPDATE_USER_REQUEST = 'User.UPDATE_USER_REQUEST'
export const UPDATE_USER_SUCCESS = 'User.UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILURE = 'User.UPDATE_USER_FAILURE'

export const UPDATE_PASSWORD_REQUEST = 'User.UPDATE_PASSWORD_REQUEST'
export const UPDATE_PASSWORD_SUCCESS = 'User.UPDATE_PASSWORD_SUCCESS'
export const UPDATE_PASSWORD_FAILURE = 'User.UPDATE_PASSWORD_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
export const getToken = () => (dispatch, getState, {cookies}) => {
  const token = cookies.get(TOKEN_COOKIE)
  return {token}
}

export const logout = () => (dispatch, getState, {cookies}) => {
  cookies.remove(TOKEN_COOKIE, {path: ''})
  dispatch({type: LOGOUT_SUCCESS})
}

export const getUserSuccess = (user) => ({type: GET_USER_SUCCESS, user})

export const getUser = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {user} = getState().user
  if (!user && token) {
    dispatch({type: GET_USER_REQUEST})
    return fetch(`/current-user`, {
      method: 'GET',
      token,
      success: (user) => dispatch(getUserSuccess(user)),
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
    failure: (error) => {
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
}

export default createReducer(initialState, {
  [LOGOUT_SUCCESS]: (state, action) => RESET_STORE,
  [GET_USER_SUCCESS]: (state, {user, role}) => ({
    user,
    loggedIn: true,
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
