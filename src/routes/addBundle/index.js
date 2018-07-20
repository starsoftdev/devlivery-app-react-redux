import React from 'react'
import AddBundle from './AddBundle'
import {setCurrentRouteName} from '../../reducers/global'

async function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: 'Add Bundle',
    component: <AddBundle intl={intl}/>
  }
}

export default action
