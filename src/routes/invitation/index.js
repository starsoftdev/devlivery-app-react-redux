import React from 'react'
import {AppLayout} from '../../components'
import Invitation from './invitation'
import {setCurrentRouteName} from '../../reducers/global'

function action({params,query, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  return {
    chunks: ['register'],
    component: (
      <AppLayout>
        <Invitation redirectUrl={query.next} intl={intl} token={params.token}/>
      </AppLayout>
    ),
  }
}

export default action
