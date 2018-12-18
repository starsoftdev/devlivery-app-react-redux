import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Footer.css'
import Instagram from '../../static/instagram.svg'
import Facebook from '../../static/facebook.svg'
import Linkedin from '../../static/linkedin.svg'
import Logo from '../../static/logo.svg'
import {DASHBOARD_ROUTES, HOME_ROUTES} from '../../routes'
import cn from 'classnames'
import {injectIntl} from 'react-intl'
import messages from './messages'
import {TERMS_ROUTE, PRIVACY_ROUTE} from '../../routes'
import { Link } from '../../components'

class Footer extends React.Component {
  render() {
    const {currentRouteName, intl} = this.props
    return (
      <footer
        className={
          cn(s.footer,
            [
              ...HOME_ROUTES,
              ...DASHBOARD_ROUTES,
            ].includes(currentRouteName) && s.light
          )}
      >
        <div className={s.topFooter}>
          <div className={s.logoWrapper}>
            <Logo/>
          </div>
          <ul className={s.menu}>
            <li>
              <a>{intl.formatMessage(messages.faq)}</a>
            </li>
            <li>
              <Link to={TERMS_ROUTE}>
                {intl.formatMessage(messages.terms)}
              </Link>
            </li>
            <li>
              <Link to={PRIVACY_ROUTE}>
                {intl.formatMessage(messages.privacy)}
              </Link>
            </li>
            <li>
              <a>{intl.formatMessage(messages.shipping)}</a>
            </li>
          </ul>
          <ul className={s.socialMedia}>
            <li>
              {/*<a><Instagram/></a>*/}
            </li>
            <li>
              {/*<a><Linkedin/></a>*/}
            </li>
            <li>
              {/*<a><Facebook/></a>*/}
            </li>
          </ul>
        </div>
        <div className={s.companyInfo}>
          <p>by Zumi, Sonnhaldenstrasse 10, 8903 Birmensdorf</p>
          {/*<a href='tel:0406309000'>040-630 90 00</a>*/} 
          <a href='mailto:info@byzumi.com'>info@byzumi.com</a>
        </div>
        <p className={s.copyright}>© Copyright 2018, ByZumi</p>
      </footer>
    )
  }
}

const mapState = state => ({
  currentRouteName: state.global.currentRouteName,
})

const mapDispatch = {}

export default injectIntl(connect(mapState, mapDispatch)(withStyles(s)(Footer)))

