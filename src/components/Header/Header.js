import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Header.css'

class Header extends React.Component {
  render() {
    const {currentRouteName} = this.props
    return (
      <div>
      </div>
    )
  }
}

const mapState = state => ({
  currentRouteName: state.global.currentRouteName,
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Header))
