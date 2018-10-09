import React from 'react'
import Purchase12 from './Purchase12'
import {setCurrentRouteName} from '../../reducers/global'
import {updateOrderMeta} from '../../reducers/purchase';
import {getUserPermission} from '../../reducers/permissions';

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(updateOrderMeta())
  store.dispatch(getUserPermission())
  return {
    chunks: ['purchase'],
    title: 'Purchase',
    actions: null,
    component: <Purchase12 intl={intl}/>
  }
}

export default action
