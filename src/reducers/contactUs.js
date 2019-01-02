import createReducer, {RESET_STORE} from '../createReducer'
import {getToken} from './user'
import {message} from 'antd'
import { getFormErrors, showErrorMessage } from '../utils'

// ------------------------------------
// Constants
// ------------------------------------

export const SEND_CONTACT_US_REQUEST = 'ContactUs.SEND_CONTACT_US_REQUEST'
export const SEND_CONTACT_US_SUCCESS = 'ContactUs.SEND_CONTACT_US_SUCCESS'
export const SEND_CONTACT_US_FAILURE = 'ContactUs.SEND_CONTACT_US_FAILURE'

export const CLEAR = 'ContactUs.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------

export const sendEnquiries = (values,callback) => (dispatch, getState, {fetch}) => {
  dispatch({type: SEND_CONTACT_US_REQUEST})
  const {name, phone, email, subject, message, attachments} = values
  const {token} = dispatch(getToken())
  
  return fetch(`/enquiries`, {
    method: 'POST',
    token,
    body: {
      name,
      phone,
      email,
      subject,
      message,
      attachments:typeof attachments === 'string' && attachments.length <= 0 ? []:attachments,
    },
    success: (res) => {
      message.success("Successfully sent message.");
      dispatch({type: SEND_CONTACT_US_SUCCESS, res})
      if (callback) callback()
    },
    failure: (res) => {
      const { formErrors } = getFormErrors({ ...res, values })
      
      if (formErrors && callback)
        callback(formErrors)
      else
        // TODO
        message.error('Something went wrong. Please try again.')
      dispatch({type: SEND_CONTACT_US_FAILURE})
    }
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
}

export default createReducer(initialState, {
  [SEND_CONTACT_US_REQUEST]: (state, action) => ({
    loading: true,
  }),
  [SEND_CONTACT_US_SUCCESS]: (state, action) => ({
    loading: false,
  }),
  [SEND_CONTACT_US_FAILURE]: (state, action) => ({
    loading: false,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
