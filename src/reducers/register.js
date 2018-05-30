import createReducer, {RESET_STORE} from '../createReducer'

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
      history.replace('/login')
    },
    failure: () => {
      dispatch({type: REGISTER_FAILURE, error: 'Something went wrong. Please try again.'})
    },
  })
}

export const setAccountType = (accountType) => ({type: SET_ACCOUNT_TYPE, accountType})

export const setIndividualDetails = (individualDetails) => (dispatch, getState, {history}) => {
  dispatch({type: SET_INDIVIDUAL_DETAILS, individualDetails})
  history.push('/register/team-details')
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  error: null,
  accountType: null,
  individualDetails: null,
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
  [SET_ACCOUNT_TYPE]: (state, {accountType}) => ({
    accountType,
  }),
  [SET_INDIVIDUAL_DETAILS]: (state, {individualDetails}) => ({
    individualDetails,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
