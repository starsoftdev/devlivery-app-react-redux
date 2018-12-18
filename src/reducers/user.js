import createReducer, { RESET_STORE } from '../createReducer'
import { STATE_COOKIE, TOKEN_COOKIE, DAY } from '../constants'
import { getBirthday } from '../utils'
import { message } from 'antd'
import { getFormErrors, showErrorMessage, getOrdering } from '../utils'
import { navigateToNextRouteName } from './global';
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

export const UPLOAD_AVATAR_REQUEST = 'User.UPLOAD_AVATAR_REQUEST'
export const UPLOAD_AVATAR_SUCCESS = 'User.UPLOAD_AVATAR_SUCCESS'
export const UPLOAD_AVATAR_FAILURE = 'User.UPLOAD_AVATAR_FAILURE'

export const GET_ALLCARDS_REQUEST = 'User.GET_ALLCARDS_REQUEST'
export const GET_ALLCARDS_SUCCESS = 'User.GET_ALLCARDS_SUCCESS'

export const SET_CHANGE_SETTIING = "Contacts.SET_CHANGE_SETTIING"

// ------------------------------------
// Actions
// ------------------------------------
export const getToken = () => (dispatch, getState, { cookies }) => {
  const token = cookies.get(TOKEN_COOKIE, { path: '/' })
  return { token }
}

export const logout = () => (dispatch, getState, { cookies }) => {
  cookies.remove(TOKEN_COOKIE, { path: '/' })
  cookies.remove(STATE_COOKIE, { path: '/' })
  dispatch({ type: LOGOUT_SUCCESS })
}
export const checkToken = () => (dispatch, getState, { cookies }) => {
  const token = cookies.get(TOKEN_COOKIE, { path: '/' })
    
  if(token === null || token === undefined)
  {
    dispatch(logout());
  }
}
export const getUserSuccess = (user) => ({ type: GET_USER_SUCCESS, user })

export const getUser = () => (dispatch, getState, { fetch, cookies }) => {
  const { token } = dispatch(getToken())
  const { user } = getState().user
  if (!user && token) {
    dispatch({ type: GET_USER_REQUEST })
    return fetch(`/current-user`, {
      method: 'GET',
      token,
      success: (res) => dispatch(getUserSuccess(res.data)),
      failure: () => {
        dispatch({ type: GET_USER_FAILURE })
        cookies.remove(TOKEN_COOKIE, { path: '/' })
        cookies.remove(STATE_COOKIE, { path: '/' })
      }
    })
  } else {
    return user
  }
}

export const getUserDetails = (callback) => (dispatch, getState, { fetch, history }) => {
  const { token } = dispatch(getToken())
  const { user } = getState().user
  dispatch({ type: GET_USER_REQUEST })
  if(user && user.id || callback)
  {
    return fetch(`/users?filter_key=id&filter_value=${user.id}&with=addresses,preference,billing`, {
      method: 'GET',
      token,
      success: (res) => {
        if(callback)
         callback(res.data[0])
        else dispatch(getUserSuccess(res.data[0]))
      },
      failure: () => dispatch({ type: GET_USER_FAILURE })
    })
  }
  else {
    history.push('/login');
  }
}

export const updateUser = ({ user, birthday, preference, ...values }, form, msg, redrict) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: UPDATE_USER_REQUEST })
  
  return fetch(`/edit-settings`, {
    method: 'POST',
    token,
    body: {
      ...values,
      user: {
        ...user,
        dob: getBirthday(birthday),
      },
      preference: {
        notify_on_reminders: preference.notify_on_reminders ? preference.notify_on_reminders : false,
        receive_promotional_emails: preference.receive_promotional_emails ? preference.receive_promotional_emails : false,
        remind: preference.remind || 0,
      },
    },
    success: (res) => {
      dispatch({ type: UPDATE_USER_SUCCESS })
      message.success(res.data)
      dispatch(getUserDetails())
      const changedSetting = false;
      dispatch({type:SET_CHANGE_SETTIING,changedSetting});

      if(redrict)
      {
        dispatch(navigateToNextRouteName(redrict));
      }
    },
    failure: (res) => {
      dispatch({ type: UPDATE_USER_FAILURE })
      const { formErrors } = getFormErrors({ ...res, values })
      if (formErrors)
        form.setFields(formErrors)
      else
        message.error('Something went wrong. Please try again.')
    }
  })
}

export const updatePassword = (values, form) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: UPDATE_PASSWORD_REQUEST })
  
  return fetch(`/update-password`, {
    method: 'POST',
    token,
    body: values,
    success: (res) => {
      dispatch({ type: UPDATE_PASSWORD_SUCCESS })
      message.success('Password changed.')
      form.resetFields()
    },
    failure: (error) => {
      showErrorMessage(error);
      dispatch({ type: UPDATE_PASSWORD_FAILURE, error })
    }
  })
}

export const uploadAvatar = (imageBlob) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: UPLOAD_AVATAR_REQUEST })
  return fetch(`/update-avatar`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      image: imageBlob,
    },
    success: () => {
      dispatch({ type: UPLOAD_AVATAR_SUCCESS })
      dispatch(getUserDetails())
    },
    failure: (error) => {
      dispatch({ type: UPLOAD_AVATAR_FAILURE })
      if (error && error.image) {
        message.error(error.image)
      }
    }
  })
}
export const uploadLogo = (imageBlob) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: UPLOAD_AVATAR_REQUEST })
  return fetch(`/update-company-logo`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      image: imageBlob,
    },
    success: (res) => {
      dispatch({ type: UPLOAD_AVATAR_SUCCESS })
      dispatch(getUserDetails())
    },
    failure: (error) => {
      dispatch({ type: UPLOAD_AVATAR_FAILURE })
      if (error && error.image) {
        message.error(error.image)
      }
    }
  })
}
export const getAllCards = () => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: GET_ALLCARDS_REQUEST })
  return fetch(`/user/get/all-cards`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({ type: GET_ALLCARDS_SUCCESS, cards: res.data })
    },
    failure: (err) => {
      dispatch({ type: GET_ALLCARDS_SUCCESS, cards: [] })
    }
  })
}
export const addCard = (card, callback) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: GET_ALLCARDS_REQUEST })
  return fetch(`/user/add-card`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      stripeToken: card.id
    },
    success: () => {
      message.success('successfully added card.');
      dispatch(getAllCards());
      if (callback)
        callback(true)
    },
    failure: (error) => {
      showErrorMessage(error)
      if (callback)
        callback(false)
      dispatch(getAllCards());
    }
  })
}
export const deleteCard = (cardid, callback) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: GET_ALLCARDS_REQUEST })
  return fetch(`/user/delete/card/${cardid}`, {
    method: 'POST',
    token,
    success: async (res) => {
      message.success('successfully deleted card.');
      await dispatch(getAllCards());
      if (callback)
        callback(true)
    },
    failure: (error) => {
      showErrorMessage(error)
      if (callback)
        callback(false)
      dispatch(getAllCards());
    }
  })
}
export const setDefaultCard = (card_id,callback) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: GET_ALLCARDS_REQUEST })
  return fetch(`/user/set-default-card`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      card_id
    },
    success: async (res) => {
      await dispatch(getAllCards());
      if(callback) callback();
    },
    failure: (error) => {
      if(callback) callback();
      dispatch(getAllCards());
    }
  })
}
export const setChangingStatusSetting = (changedSetting) => (dispatch, getState, {fetch, history}) => {
  dispatch({type:SET_CHANGE_SETTIING,changedSetting});
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    updatingUser: false,
    updatingPassword: false,
    uploadingAvatar: false,
    cards: false,
  },
  loggedIn: false,
  error: null,
  user: null,
  cards: [],
}

export default createReducer(initialState, {
  [LOGOUT_SUCCESS]: (state, action) => RESET_STORE,
  [GET_USER_SUCCESS]: (state, { user }) => ({
    user,
    loggedIn: true,
  }),
  [GET_ALLCARDS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      cards: true,
    }
  }),
  [GET_ALLCARDS_SUCCESS]: (state, { cards }) => ({
    cards,
    loading: {
      ...state.loading,
      cards: false,
    }
  }),
  [UPDATE_USER_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      updatingUser: true,
    }
  }),
  [UPDATE_USER_SUCCESS]: (state, action) => ({
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
  [UPDATE_PASSWORD_FAILURE]: (state, { error }) => ({
    error,
    loading: {
      ...state.loading,
      updatingPassword: false,
    }
  }),
  [UPLOAD_AVATAR_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      uploadingAvatar: true,
    }
  }),
  [UPLOAD_AVATAR_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      uploadingAvatar: false,
    }
  }),
  [UPLOAD_AVATAR_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      uploadingAvatar: false,
    }
  }),
  [SET_CHANGE_SETTIING]: (state, {changedSetting}) => ({
    changedSetting,
  }),
  
})
