import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {message} from 'antd'
import {getToken,updateUser} from './user'
import {DATE_FORMAT} from '../constants'
import {getFormErrors} from '../utils'

// ------------------------------------
// Constants
// ------------------------------------
export const INDIVIDUAL_ACCOUNT = 'individual'
export const TEAM_ACCOUNT = 'team'

export const REGISTER_REQUEST = 'Register.REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'Register.REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'Register.REGISTER_FAILURE'

export const SET_ACCOUNT_TYPE = 'Register.SET_ACCOUNT_TYPE'
export const SET_INVITE_TOKEN = 'Register.SET_INVITE_TOKEN'

export const GET_ROLES_REQUEST = 'Register.GET_ROLES_REQUEST'
export const GET_ROLES_SUCCESS = 'Register.GET_ROLES_SUCCESS'
export const GET_ROLES_FAILURE = 'Register.GET_ROLES_FAILURE'

export const ADD_TEAM_REQUEST = 'Register.ADD_TEAM_REQUEST'
export const ADD_TEAM_SUCCESS = 'Register.ADD_TEAM_SUCCESS'
export const ADD_TEAM_FAILURE = 'Register.ADD_TEAM_FAILURE'

export const INVITE_PEOPLE_REQUEST = 'Register.INVITE_PEOPLE_REQUEST'
export const INVITE_PEOPLE_SUCCESS = 'Register.INVITE_PEOPLE_SUCCESS'
export const INVITE_PEOPLE_FAILURE = 'Register.INVITE_PEOPLE_FAILURE'

export const CLEAR = 'Register.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const register = (values, form) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: REGISTER_REQUEST, individualDetails: values})
  const {accountType, individualDetails: {birthday, ...otherDetails},inviteToken} = getState().register
  
  return fetch(`/signup`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      ...otherDetails,
      account_type: accountType,
      ...birthday ? {
        dob: birthday.format(DATE_FORMAT)
      } : {},
      ...inviteToken ?{
        invitation_token:inviteToken
      } : {},
      //address: otherDetails.company+otherDetails.address ? " "+otherDetails.address:""
    },
    success: (res) => {
      let inviteToken = null;
      dispatch({type:SET_INVITE_TOKEN,inviteToken})
      dispatch({type: REGISTER_SUCCESS})
      dispatch(loginSuccess(res.data))
      
      dispatch(updateUser({
        address:{
          address: otherDetails.company+otherDetails.address ? " "+otherDetails.address:"",
          city: otherDetails.city,
          company: otherDetails.company,
          country: otherDetails.country,
          first_name: null,
          //id: 310,
          last_name: null,
          postal_code: otherDetails.postal_code,
          state: otherDetails.state,
        },

        billing:
        {
          card_number: null,
          cvv: null,
          expiry_month: null,
          expiry_year: null,
          name_on_card: null,
        },

        preference:
        {
          notify_on_reminders: false,
          receive_promotional_emails: false,
          remind: 0
        },

        user:{
          dob: birthday ? birthday.format(DATE_FORMAT):null,
          email: otherDetails.email,
          first_name: otherDetails.first_name,
          last_name: otherDetails.last_name,
          nickname: "",
          phone: otherDetails.phone,
        }

      }))
      if (accountType === TEAM_ACCOUNT) {
        history.push('/register/team-details')
      } else {
        history.push('/dashboard/orders')
        dispatch(clear())
      }
    },
    failure: (res) => {
      dispatch({type: REGISTER_FAILURE})
      const {formErrors} = getFormErrors({...res, values})
      if (formErrors)
        form.setFields(formErrors)
      else
      // TODO
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

export const addTeam = (values) => (dispatch, getState, {fetch, history}) => {
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
      history.push('/register/invite-people/false')
    },
    failure: () => {
      dispatch({type: ADD_TEAM_FAILURE})
      message.error('Something went wrong. Please try again.')
    },
  })
}

export const invitePeople = (people) => (dispatch, getState, {fetch, history}) => {
  const {token} = dispatch(getToken())
  dispatch({type: INVITE_PEOPLE_REQUEST, people})
  return fetch(`/invitations`, {
    method: 'POST',
    body: {
      users: people,
    },
    token,
    success: (res) => {
      dispatch({type: INVITE_PEOPLE_SUCCESS})
      history.push('/dashboard/orders')
      message.success(res.data)
      dispatch(clear())
    },
    failure: () => {
      dispatch({type: INVITE_PEOPLE_FAILURE})
      message.error('Something went wrong. Please try again.')
    },
  })
  
}
export const acceptInvitation = (inviteToken) => (dispatch, getState, {fetch,history}) => {
  if(inviteToken)
  {
    dispatch(setAccountType(INDIVIDUAL_ACCOUNT));
    dispatch({type:SET_INVITE_TOKEN,inviteToken});
    history && history.push('/register/individual-details');
  }
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
  [SET_INVITE_TOKEN]: (state, {inviteToken}) => ({
    inviteToken,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
