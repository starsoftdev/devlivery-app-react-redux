import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Header.css'
import Logo from '../../static/logo.svg'
import {DASHBOARD_ROUTES, HOME_ROUTE, LOGIN_ROUTE, LOGOUT_ROUTE, ORDERS_ROUTE, REGISTER1_ROUTE,} from '../../routes'
import {Link, LanguageSwitcher} from '../../components'
import cn from 'classnames'

class Header extends React.Component {
  render() {
    const {currentRouteName, user} = this.props
    return (
      <header
        className={cn(
          [
            HOME_ROUTE,
            ...DASHBOARD_ROUTES,
          ].includes(currentRouteName) && s.light
        )}
      >
        <div className={s.header}>
          <div className={s.leftMenu}>
            <LanguageSwitcher/>
          </div>
          <Link to={HOME_ROUTE}>
            <Logo/>
          </Link>
          {[
            HOME_ROUTE,
            ...DASHBOARD_ROUTES,
          ].includes(currentRouteName) && (
            <div className={s.rightMenu}>
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
          )}
        </div>
        {[
          HOME_ROUTE,
          ...DASHBOARD_ROUTES,
        ].includes(currentRouteName) && (
          <ul className={s.bottomMenu}>
            <li>
              <Link to={ORDERS_ROUTE}>New Arrivals</Link>
            </li>
            <li>
              <Link to={ORDERS_ROUTE}>Card Store</Link>
            </li>
            <li>
              <Link to={ORDERS_ROUTE}>Gift Store</Link>
            </li>
            <li>
              <Link to={ORDERS_ROUTE}>About</Link>
            </li>
            <li>
              <Link to={ORDERS_ROUTE}>Contact Us</Link>
            </li>
          </ul>
        )}
      </header>
    )
  }
}

const mapState = state => ({
  currentRouteName: state.global.currentRouteName,
  user: state.user.user,
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Header))
