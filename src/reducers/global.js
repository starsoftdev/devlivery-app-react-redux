import createReducer from '../createReducer'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CURRENT_PATHNAME = 'Global.SET_CURRENT_PATHNAME'
export const SET_CURRENT_ROUTE_NAME = 'Global.SET_CURRENT_ROUTE_NAME'

export const SET_CONFIG_VARS = 'Global.SET_CONFIG_VARS'

// ------------------------------------
// Actions
// ------------------------------------
export const setConfigVars = ({apiUrl}) => ({
  type: SET_CONFIG_VARS,
  apiUrl,
})

export const setCurrentPathname = (currentPathname) => ({type: SET_CURRENT_PATHNAME, currentPathname})

export const setCurrentRouteName = (currentRouteName) => ({type: SET_CURRENT_ROUTE_NAME, currentRouteName})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentPathname: null,
  currentRouteName: null,
  apiUrl: null,
}

export default createReducer(initialState, {
  [SET_CURRENT_PATHNAME]: (state, {currentPathname}) => ({
    currentPathname,
  }),
  [SET_CURRENT_ROUTE_NAME]: (state, {currentRouteName}) => ({
    currentRouteName,
  }),
  [SET_CONFIG_VARS]: (state, {apiUrl}) => ({
    apiUrl,
  }),
})
