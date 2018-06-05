import createReducer, {RESET_STORE} from '../createReducer'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_OCCASION = 'Purchase.SET_OCCASION'

export const GET_OCCASIONS_REQUEST = 'Purchase.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Purchase.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Purchase.GET_OCCASIONS_FAILURE'

export const SUBMIT_OCCASION_REQUEST = 'Purchase.SUBMIT_OCCASION_REQUEST'
export const SUBMIT_OCCASION_SUCCESS = 'Purchase.SUBMIT_OCCASION_SUCCESS'
export const SUBMIT_OCCASION_FAILURE = 'Purchase.SUBMIT_OCCASION_FAILURE'

export const CLEAR = 'Purchase.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const setOccasion = (occasion) => ({type: SET_OCCASION, occasion})

export const getOccasions = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASIONS_REQUEST})
  return fetch(`/occasions?take=100`, {
    method: 'GET',
    success: (res) => {
      dispatch({type: GET_OCCASIONS_SUCCESS, occasions: res.data})
    },
    failure: () => {
      dispatch({type: GET_OCCASIONS_FAILURE})
    }
  })
}

export const submitOccasion = () => (dispatch, getState, {fetch, history}) => {
  const {occasion} = getState().purchase
  if (!occasion) return
  dispatch({type: SUBMIT_OCCASION_REQUEST})
  history.push('/purchase/lettering-technique')
  return fetch(`/guest/set-occasion`, {
    method: 'POST',
    body: {
      occasion_id: occasion,
    },
    success: (res) => {
      console.log(res)
      dispatch({type: SUBMIT_OCCASION_SUCCESS})
    },
    failure: () => {
      dispatch({type: SUBMIT_OCCASION_FAILURE})
    }
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    occasions: false,
  },
  occasion: null,
  occasions: [],
}

export default createReducer(initialState, {
  [SET_OCCASION]: (state, {occasion}) => ({
    occasion,
  }),
  [GET_OCCASIONS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      occasions: true,
    }
  }),
  [GET_OCCASIONS_SUCCESS]: (state, {occasions}) => ({
    occasions,
    loading: {
      ...state.loading,
      occasions: false,
    }
  }),
  [GET_OCCASIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      occasions: false,
    }
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
