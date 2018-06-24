import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Header.css'
import Logo from '../../static/logo.svg'
import {DASHBOARD_ROUTES, HOME_ROUTE, LOGIN_ROUTE, LOGOUT_ROUTE, ORDERS_ROUTE, REGISTER1_ROUTE,} from '../../routes'
import {Link, LanguageSwitcher} from '../../components'
import cn from 'classnames'
import {injectIntl} from 'react-intl'
import messages from './messages'

class Header extends React.Component {
  render() {
    const {currentRouteName, user, intl} = this.props
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
          HOME_ROUTE,
          ...DASHBOARD_ROUTES,
        ].includes(currentRouteName) && (
          <ul className={s.bottomMenu}>
            <li>
              <Link to={ORDERS_ROUTE}>{intl.formatMessage(messages.newArrivals)}</Link>
            </li>
            <li>
              <Link to={ORDERS_ROUTE}>{intl.formatMessage(messages.cardStore)}</Link>
            </li>
            <li>
              <Link to={ORDERS_ROUTE}>{intl.formatMessage(messages.giftStore)}</Link>
            </li>
            <li>
              <Link to={ORDERS_ROUTE}>{intl.formatMessage(messages.about)}</Link>
            </li>
            <li>
              <Link to={ORDERS_ROUTE}>{intl.formatMessage(messages.contact)}</Link>
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

export default connect(mapState, mapDispatch)(injectIntl(withStyles(s)(Header)))
