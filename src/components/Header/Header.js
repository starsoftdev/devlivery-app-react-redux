import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Header.css'
import Logo from '../../static/logo.svg'
import {HOME_ROUTE, LOGIN_ROUTE, REGISTER1_ROUTE, LOGOUT_ROUTE} from '../../routes'
import {Link} from '../../components'
import cn from 'classnames'

class Header extends React.Component {
  render() {
    const {currentRouteName, user} = this.props
    return (
      <div className={cn(s.header, [HOME_ROUTE].includes(currentRouteName) && s.light)}>
        <Link to={HOME_ROUTE}>
          <Logo/>
        </Link>
        <div className={s.rightSideMenu}>
          {!user ? (
            <React.Fragment>
              <Link to={LOGIN_ROUTE}>
                Login
              </Link>
              <Link to={REGISTER1_ROUTE}>
                Sign up
              </Link>
            </React.Fragment>
          ) : (
            <Link to={LOGOUT_ROUTE}>
              Sign Out
            </Link>
          )}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  currentRouteName: state.global.currentRouteName,
  user: state.user.user,
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Header))
