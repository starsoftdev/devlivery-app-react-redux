import createReducer from '../createReducer'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CURRENT_PATHNAME = 'Global.SET_CURRENT_PATHNAME'
export const SET_CURRENT_ROUTE_NAME = 'Global.SET_CURRENT_ROUTE_NAME'

export const SET_CONFIG_VARS = 'Global.SET_CONFIG_VARS'

export const SET_NEXT_ROUTE_NAME = 'Global.SET_NEXT_ROUTE_NAME';
// ------------------------------------
// Actions
// ------------------------------------
export const setConfigVars = ({apiUrl, locales, stripeApiKey}) => ({
  type: SET_CONFIG_VARS,
  apiUrl,
  locales,
  stripeApiKey,
})

export const setCurrentPathname = (currentPathname) => ({type: SET_CURRENT_PATHNAME, currentPathname})

export const setCurrentRouteName = (currentRouteName) => ({type: SET_CURRENT_ROUTE_NAME, currentRouteName})

export const setNextRouteName = (nextPathname) => ({type: SET_NEXT_ROUTE_NAME,nextPathname})

export const isLeaveEditContactPage = (path, path2 = '') => {
  const absoultePath = '/dashboard/contacts/';
  if(path === null || typeof path === 'object')
    return false;
  var splits = path.split(absoultePath);
  if(splits.length !== 2 || splits[0] != "")
    return false;
  const splits2 = path2.split(absoultePath);
  if(!isNaN(splits[1]) || splits[1] === 'new')
  {
    //if (path2 === '/dashboard/contacts') return false;
    if (splits2.length >= 2 && !isNaN(splits2[1])) return false;
    return true;
  }
  return false;
}

export const navigateToNextRouteName = (routeName) => (dispatch, getState, {fetch, history}) => {
  dispatch(setCurrentPathname(null));
  history.push(routeName)
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentPathname: null,
  currentRouteName: null,
  apiUrl: null,
  locales: [],
  stripeApiKey: null,
}

export default createReducer(initialState, {
  [SET_NEXT_ROUTE_NAME]:(state,{nextPathname}) =>({
    nextPathname,
  }),
  [SET_CURRENT_PATHNAME]: (state, {currentPathname}) => ({
    prevPathname:state.currentPathname,
    currentPathname,
  }),
  [SET_CURRENT_ROUTE_NAME]: (state, {currentRouteName}) => ({
    currentRouteName,
  }),
  [SET_CONFIG_VARS]: (state, {apiUrl, locales, stripeApiKey}) => ({
    apiUrl,
    locales,
    stripeApiKey,
  }),
})
