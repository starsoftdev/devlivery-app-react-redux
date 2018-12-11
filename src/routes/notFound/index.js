import React from 'react'
import {AppLayout} from '../../components'

async function action() {
  return {
    title: 'Not Found',
    status: 404,
    component: <AppLayout><span style={{textAlign:'center'}}>Not Found</span></AppLayout>,
  }
}

export default action
