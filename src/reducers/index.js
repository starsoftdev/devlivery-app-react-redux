import {combineReducers} from 'redux'
import global from './global'
import user from './user'
import login from './login'

export default combineReducers({
  global,
  user,
  login,
})
