import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Header.css'
import Logo from '../../static/logo.svg'
import {
  ABOUT_ROUTE,
  CARD_STORE_ROUTE,
  DASHBOARD_ROUTES,
  GIFT_STORE_ROUTE,
  HOME_ROUTE,
  HOME_ROUTES,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  NEW_ARRIVALS_ROUTE,
  ORDERS_ROUTE,
  REGISTER1_ROUTE,
} from '../../routes'
import {LanguageSwitcher, Link} from '../../components'
import cn from 'classnames'
import {injectIntl} from 'react-intl'
import messages from './messages'

class Header extends React.Component {
  render() {
    const {className, currentRouteName, user, intl, loggedIn} = this.props
    return (
      <header
        className={cn(
          [
            ...HOME_ROUTES,
            ...DASHBOARD_ROUTES,
          ].includes(currentRouteName) && s.light,
        )}
      >
        <div className={cn(s.header, className || s.layoutHeader)}>
          <div className={s.leftMenu}>
            <LanguageSwitcher/>
          </div>
          <Link to={HOME_ROUTE}>
            <Logo/>
          </Link>
          {[
            ...HOME_ROUTES,
            ...DASHBOARD_ROUTES,
          ].includes(currentRouteName) && (
            <div className={s.rightMenu}>
              {!user ? (
                <React.Fragment>
                  <Link to={LOGIN_ROUTE}>
                    {intl.formatMessage(messages.login)}
                  </Link>
                  <Link to={REGISTER1_ROUTE}>
                    {intl.formatMessage(messages.signUp)}
                  </Link>
                </React.Fragment>
              ) : (
                <Link to={LOGOUT_ROUTE}>
                  {intl.formatMessage(messages.signOut)}
                </Link>
              )}
            </div>
          )}
        </div>
        {[
          ...HOME_ROUTES,
          ...DASHBOARD_ROUTES,
        ].includes(currentRouteName) && (
          <ul className={s.bottomMenu}>
            <li>
              <Link to={NEW_ARRIVALS_ROUTE}>{intl.formatMessage(messages.newArrivals)}</Link>
            </li>
            <li>
              <Link to={CARD_STORE_ROUTE}>{intl.formatMessage(messages.cardStore)}</Link>
            </li>
            <li>
              <Link to={GIFT_STORE_ROUTE}>{intl.formatMessage(messages.giftStore)}</Link>
            </li>
            <li>
              <Link to={ABOUT_ROUTE}>{intl.formatMessage(messages.about)}</Link>
            </li>
            <li>
              <Link to={ORDERS_ROUTE}>{intl.formatMessage(messages.contact)}</Link>
            </li>
            {loggedIn && (
              <li>
                <Link to={ORDERS_ROUTE}>{intl.formatMessage(messages.dashboard)}</Link>
              </li>
            )}
          </ul>
        )}
      </header>
    )
  }
}

const mapState = state => ({
  currentRouteName: state.global.currentRouteName,
  user: state.user.user,
  loggedIn: state.user.loggedIn,
})

const mapDispatch = {}

export default injectIntl(connect(mapState, mapDispatch)(withStyles(s)(Header)))
