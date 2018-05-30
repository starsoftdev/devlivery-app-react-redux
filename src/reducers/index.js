import {combineReducers} from 'redux'
import global from './global'
import user from './user'
import login from './login'
import resetPassword from './resetPassword'
import setPassword from './setPassword'
import register from './register'

export default combineReducers({
  global,
  user,
  login,
  resetPassword,
  setPassword,
  register,
})
