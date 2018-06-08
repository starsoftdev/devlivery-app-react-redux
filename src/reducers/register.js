import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {message} from 'antd'

// ------------------------------------
// Constants
// ------------------------------------
export const INDIVIDUAL_ACCOUNT = 'individual'
export const TEAM_ACCOUNT = 'team'

export const REGISTER_REQUEST = 'Register.REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'Register.REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'Register.REGISTER_FAILURE'

export const SET_ACCOUNT_TYPE = 'Register.SET_ACCOUNT_TYPE'
export const SET_INDIVIDUAL_DETAILS = 'Register.SET_INDIVIDUAL_DETAILS'
export const SET_TEAM_DETAILS = 'Register.SET_TEAM_DETAILS'

export const CLEAR = 'Register.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const register = (people) => (dispatch, getState, {fetch}) => {
  const {accountType, individualDetails: {year, month, date, ...otherDetails}, teamDetails} = getState().register
  dispatch({type: REGISTER_REQUEST})
  return fetch(`/signup`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      ...otherDetails,
      account_type: accountType,
      dob: `${date}-${month}-${year}`
      // TODO send this data to backend when it's done
      // teamDetails,
      // people,
    },
    success: (res) => {
      dispatch({type: REGISTER_SUCCESS})
      dispatch(loginSuccess(res.data, '/'))
    },
    failure: () => {
      dispatch({type: REGISTER_FAILURE})
      message.error('Something went wrong. Please try again.')
    },
  })
}

export const setAccountType = (accountType) => ({type: SET_ACCOUNT_TYPE, accountType})

export const setIndividualDetails = (individualDetails) => (dispatch, getState, {history}) => {
  dispatch({type: SET_INDIVIDUAL_DETAILS, individualDetails})
  history.push('/register/team-details')
}

export const setTeamDetails = (teamDetails) => (dispatch, getState, {history}) => {
  dispatch({type: SET_TEAM_DETAILS, teamDetails})
  history.push('/register/invite-people')
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  accountType: null,
  individualDetails: null,
  teamDetails: null,
}

export default createReducer(initialState, {
  [REGISTER_REQUEST]: (state, action) => ({
    loading: true,
  }),
  [REGISTER_SUCCESS]: (state, action) => RESET_STORE,
  [REGISTER_FAILURE]: (state, action) => ({
    loading: false,
  }),
  [SET_ACCOUNT_TYPE]: (state, {accountType}) => ({
    accountType,
  }),
  [SET_INDIVIDUAL_DETAILS]: (state, {individualDetails}) => ({
    individualDetails,
  }),
  [SET_TEAM_DETAILS]: (state, {teamDetails}) => ({
    teamDetails,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
