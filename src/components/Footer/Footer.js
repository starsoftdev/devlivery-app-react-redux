import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Footer.css'
import Instagram from '../../static/instagram.svg'
import Facebook from '../../static/facebook.svg'
import Linkedin from '../../static/linkedin.svg'
import Logo from '../../static/logo.svg'
import {
  ADD_CONTACTS_ROUTE, CONTACT_GROUPS_ROUTE,
  CONTACTS_ROUTE,
  IMPORT_CONTACTS_ROUTE,
  MANAGE_TEAM_ROUTE,
  ORDERS_ROUTE,
  REPORTS_ROUTE
} from '../../routes'
import cn from 'classnames'

class Footer extends React.Component {
  render() {
    const {currentRouteName} = this.props
    return (
      <footer
        className={
          cn(s.footer,
            [
              ORDERS_ROUTE,
              CONTACTS_ROUTE,
              ADD_CONTACTS_ROUTE,
              IMPORT_CONTACTS_ROUTE,
              REPORTS_ROUTE,
              MANAGE_TEAM_ROUTE,
              CONTACT_GROUPS_ROUTE,
            ].includes(currentRouteName) && s.light
          )}
      >
        <div className={s.topFooter}>
          <div className={s.logoWrapper}>
            <Logo/>
          </div>
          <ul className={s.menu}>
            <li>
              <a>FAQ</a>
            </li>
            <li>
              <a>Terms of Service</a>
            </li>
            <li>
              <a>Privacy Policy</a>
            </li>
            <li>
              <a>Shipping & Returns</a>
            </li>
          </ul>
          <ul className={s.socialMedia}>
            <li>
              <a><Instagram/></a>
            </li>
            <li>
              <a><Linkedin/></a>
            </li>
            <li>
              <a><Facebook/></a>
            </li>
          </ul>
        </div>
        <div className={s.companyInfo}>
          <p>Anckargripsgatan 3, 211 19 Zurich, Switzerland</p>
          <a href='tel:0406309000'>040-630 90 00</a>
          <a href='mailto:info@example.ch'>info@example.ch</a>
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

export default connect(mapState, mapDispatch)(withStyles(s)(Footer))

