import React from 'react'
import {AppLayout} from '../../components'
import Login from './Login'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({params,query, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  
  return {
    chunks: ['login'],
    title: intl.formatMessage(messages.title),
    component: (
      <AppLayout>
        <Login redirectUrl={query.next} intl={intl} inpurchase={query.inpurchase}/>
      </AppLayout>
    ),
  }
}

export default action
