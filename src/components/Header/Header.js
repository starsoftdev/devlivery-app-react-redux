import React from 'react'
import { connect } from 'react-redux'
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
  REGISTER2_ROUTE,
  CONTACT_US_ROUTE,
  PRIVACY_ROUTE
} from '../../routes'
import { LanguageSwitcher, Link } from '../../components'
import cn from 'classnames'
import { injectIntl } from 'react-intl'
import messages from './messages'
import CookieConsent,{ Cookies } from "react-cookie-consent";
import { Button } from 'antd'

class Header extends React.Component {
  state ={
    _cookieconsent: undefined
  }
  componentWillMount(){
    this.setState({_cookieconsent: Cookies.get('CookieConsent')});
  }
  render() {
    const { className, currentRouteName, user, intl } = this.props
    const {_cookieconsent} = this.state;
    
    return (
      <header
        className={cn(
          [
            ...HOME_ROUTES,
            ...DASHBOARD_ROUTES,
          ].includes(currentRouteName) && s.light,
        )}
      >
        <div>
        {
          _cookieconsent===undefined &&
          <CookieConsent location="none" 
            cookieName='CookieConsent'
            cookieValue={true}
            onAccept={() => {this.setState({_cookieconsent: true})}}
            buttonStyle={{background: "green", color:"white", fontWeight: "bolder", fontSize:'15px', alignSelf:'center'}}
            style={{
                alignItems: "baseline",
                background: "#404D5F",
                color: "white",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                left: "0",
                position: "relative",
                width: "100%",
                zIndex: "999"
            }}>
            We use cookies to optimize your site experience. By interacting with our site, you agree to our use of cookies.
            <Link to={PRIVACY_ROUTE}>
              <div type='primary' className={s.morebtn}>{'Know More'}</div>
            </Link>
          </CookieConsent>
        }
        </div>
        <div className={cn(s.header, className || s.layoutHeader)}>
          {/*
          <div className={s.leftMenu}>
            <LanguageSwitcher/>
          </div>
          */}
          {[
            ...HOME_ROUTES,
            ...DASHBOARD_ROUTES,
          ].includes(currentRouteName) && (
              <div className={s.leftMenu}>
                <React.Fragment>
                  <Link to={ABOUT_ROUTE}>{intl.formatMessage(messages.about)}</Link>
                  <Link to={CONTACT_US_ROUTE}>{intl.formatMessage(messages.contact)}</Link>
                </React.Fragment>
              </div>
            )}
          <Link to={HOME_ROUTE}>
            <Logo />
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
                    <Link to={REGISTER2_ROUTE}>
                      {intl.formatMessage(messages.signUp)}
                    </Link>
                  </React.Fragment>
                ) : (
                    <React.Fragment>
                      <Link to={LOGOUT_ROUTE}>
                        {intl.formatMessage(messages.signOut)}
                      </Link>
                      <Link to={ORDERS_ROUTE}>
                        {intl.formatMessage(messages.dashboard)}
                      </Link>
                    </React.Fragment>
                  )}
              </div>
            )}
        </div>
        {/*
        [
          ...HOME_ROUTES,
          ...DASHBOARD_ROUTES,
        ].includes(currentRouteName) && (
            <ul className={s.bottomMenu}>
              <li onClick={this.getLocation}>
                <Link to={NEW_ARRIVALS_ROUTE}>{intl.formatMessage(messages.newArrivals)}</Link>
                {NEW_ARRIVALS_ROUTE === currentRouteName &&
                  <div className={s.dashWrapper}>
                    <hr className={s.underline} />
                  </div>}
              </li>
              <li>
                <Link to={CARD_STORE_ROUTE}>{intl.formatMessage(messages.cardStore)}</Link>
                {CARD_STORE_ROUTE === currentRouteName &&
                  <div className={s.dashWrapper}>
                    <hr className={s.underline} />
                  </div>}
              </li>
              <li>
                <Link to={GIFT_STORE_ROUTE}>{intl.formatMessage(messages.giftStore)}</Link>
                {GIFT_STORE_ROUTE === currentRouteName &&
                  <div className={s.dashWrapper}>
                    <hr className={s.underline} />
                  </div>}
              </li>
              <li>
                <Link to={ABOUT_ROUTE}>{intl.formatMessage(messages.about)}</Link>
                {ABOUT_ROUTE === currentRouteName &&
                  <div className={s.dashWrapper}>
                    <hr className={s.underline} />
                  </div>}
              </li>
              <li>
                <Link to={CONTACT_US_ROUTE}>{intl.formatMessage(messages.contact)}</Link>
                {CONTACT_US_ROUTE === currentRouteName &&
                  <div className={s.dashWrapper}>
                    <hr className={s.underline} />
                  </div>}
              </li>
            </ul>
          )
          */
        }
      </header>
    )
  }
}

const mapState = state => ({
  currentRouteName: state.global.currentRouteName,
  user: state.user.user,
})

const mapDispatch = {}

export default injectIntl(connect(mapState, mapDispatch)(withStyles(s)(Header)))
