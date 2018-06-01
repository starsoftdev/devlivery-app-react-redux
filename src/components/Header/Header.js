import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Header.css'
import Logo from '../../static/logo.svg'
import {HOME_ROUTE} from '../../routes'
import {Link} from '../../components'
import cn from 'classnames'

class Header extends React.Component {
  render() {
    const {currentRouteName} = this.props
    return (
      <div className={cn(s.header, [HOME_ROUTE].includes(currentRouteName) && s.light)}>
        <Link to={HOME_ROUTE}>
          <Logo/>
        </Link>
      </div>
    )
  }
}

const mapState = state => ({
  currentRouteName: state.global.currentRouteName,
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Header))
