import {combineReducers} from 'redux'
import global from './global'
import user from './user'
import login from './login'
import resetPassword from './resetPassword'
import setPassword from './setPassword'
import register from './register'
import purchase from './purchase'
import orders from './orders'
import contacts from './contacts'
import reports from './reports'
import bundles from './bundles'

export default combineReducers({
  global,
  user,
  login,
  resetPassword,
  setPassword,
  register,
  purchase,
  orders,
  contacts,
  reports,
  bundles,
})
