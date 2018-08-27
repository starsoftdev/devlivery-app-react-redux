import React from 'react'
import {connect} from 'react-redux'
import {Button, Menu} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Dashboard.css'
import {Breadcrumbs, Link, Avatar} from '../../components'
import {
  ADD_CONTACT_ROUTE,
  AUTH_PURCHASE_FLOW,
  BUNDLES_ROUTE,
  CONTACT_GROUPS_ROUTE,
  CONTACTS_ROUTE,
  HOME_ROUTE,
  IMPORT_CONTACTS_ROUTE,
  MANAGE_TEAM_ROUTE,
  ORDERS_ROUTE,
  REPORTS_ROUTE,
  USER_ROUTE,
  GROUP_PERMISSION_ROUTE
} from '../'
import OrdersIcon from '../../static/orders.svg'
import ContactsIcon from '../../static/book.svg'
import ReportsIcon from '../../static/reports.svg'
import ManageTeamIcon from '../../static/manage_team.svg'
import BundlesIcon from '../../static/shopping_bag.svg'
import SettingsIcon from '../../static/settings.svg'
import messages from './messages'
import {setFlow} from '../../reducers/purchase'
import {TEAM_ACCOUNT} from '../../reducers/register'
import { resendVerify } from '../../reducers/login';

class Dashboard extends React.Component {
  render() {
    const {children, breadcrumbs, intl, setFlow, user, resendVerify} = this.props

    const BASE_DASHBOARD_BREADCRUMBS = [
      {routeName: HOME_ROUTE, name: intl.formatMessage(messages.home)},
      {name: intl.formatMessage(messages.dashboard)}
    ]

    return (
      <div className={s.container}>
        <Menu className={s.menu} mode='inline'>
          <Menu.Item>
            <Avatar />
          </Menu.Item>
          <Menu.Item key={ORDERS_ROUTE}>
            <Link to={ORDERS_ROUTE}>
              <OrdersIcon/>
              {intl.formatMessage(messages.orders)}
            </Link>
          </Menu.Item>
          <Menu.Item key={BUNDLES_ROUTE}>
            <Link to={BUNDLES_ROUTE}>
              <BundlesIcon/>
              {intl.formatMessage(messages.bundles)}
            </Link>
          </Menu.Item>
          <Menu.SubMenu
            className={s.subMenu}
            title={
              <React.Fragment>
                <ContactsIcon/>
                {intl.formatMessage(messages.contacts)}
              </React.Fragment>
            }
          >
            <Menu.Item key={CONTACTS_ROUTE}>
              <Link to={CONTACTS_ROUTE}>
                {intl.formatMessage(messages.findContacts)}
              </Link>
            </Menu.Item>
            <Menu.Item key={IMPORT_CONTACTS_ROUTE}>
              <Link to={IMPORT_CONTACTS_ROUTE}>
                {intl.formatMessage(messages.importContacts)}
              </Link>
            </Menu.Item>
            <Menu.Item key={ADD_CONTACT_ROUTE}>
              <Link to={ADD_CONTACT_ROUTE}>
                {intl.formatMessage(messages.addContacts)}
              </Link>
            </Menu.Item>
            <Menu.Item key={CONTACT_GROUPS_ROUTE}>
              <Link to={CONTACT_GROUPS_ROUTE}>
                {intl.formatMessage(messages.contactGroups)}
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key={REPORTS_ROUTE}>
            <Link to={REPORTS_ROUTE}>
              <ReportsIcon/>
              {intl.formatMessage(messages.reports)}
            </Link>
          </Menu.Item>
          {user && user.account_type === TEAM_ACCOUNT && (
            <Menu.SubMenu
              className={s.subMenu}
              title={
                <React.Fragment>
                  <ManageTeamIcon/>
                  {intl.formatMessage(messages.manageTeam)}
                </React.Fragment>
              }
            >
              <Menu.Item key={MANAGE_TEAM_ROUTE}>
                <Link to={MANAGE_TEAM_ROUTE}>
                  {intl.formatMessage(messages.manageTeam)}
                </Link>
              </Menu.Item>
              <Menu.Item key={GROUP_PERMISSION_ROUTE}>
                <Link to={GROUP_PERMISSION_ROUTE}>
                  {intl.formatMessage(messages.permissionGroup)}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}

          <Menu.Item key={USER_ROUTE}>
            <Link to={USER_ROUTE}>
              <SettingsIcon/>
              {intl.formatMessage(messages.settings)}
            </Link>
          </Menu.Item>
        </Menu>
        <div className={s.content}>
          <div className={s.actions}>
            <Breadcrumbs
              className={s.breadcrumbs}
              breadcrumbs={[...BASE_DASHBOARD_BREADCRUMBS, ...breadcrumbs]}
            />
            <div className={s.getStartedBtn}>
            <h4 className={s.verifymsg}>{intl.formatMessage(messages.verifymsg)}</h4>
            <a
              className={s.resendBtn}
              onClick={() => resendVerify(user.id)}
            >
              {intl.formatMessage(messages.resend)}
            </a>
            <Button
              type='primary'
              onClick={() => setFlow(AUTH_PURCHASE_FLOW)}
            >
              {intl.formatMessage(messages.getStarted)}
            </Button>
            </div>
          </div>
          {children}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user.user,
})

const mapDispatch = {
  setFlow,
  resendVerify
}

export default connect(mapState, mapDispatch)(withStyles(s)(Dashboard))
