import {combineReducers} from 'redux'
import global from './global'
import user from './user'
import login from './login'
import resetPassword from './resetPassword'
import setPassword from './setPassword'
import register from './register'
import purchase from './purchase'
import orders from './orders'

export default combineReducers({
  global,
  user,
  login,
  resetPassword,
  setPassword,
  register,
  purchase,
  orders,
})
