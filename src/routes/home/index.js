import React from 'react'
import Home from './Home'
import {setCurrentRouteName} from '../../reducers/global'

async function action({store, route}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    title: 'ByZumi',
    component: <Home/>,
  }
}

export default action
