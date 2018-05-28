import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Footer.css'

class Footer extends React.Component {
  render() {
    return (
      <div>
      </div>
    )
  }
}

const mapState = state => ({
})

const mapDispatch = {
}

export default connect(mapState, mapDispatch)(withStyles(s)(Footer))

