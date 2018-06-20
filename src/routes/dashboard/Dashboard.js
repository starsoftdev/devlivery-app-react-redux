import React from 'react'
import {connect} from 'react-redux'
import {Menu} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Dashboard.css'
import {Link} from '../../components'
import {
  ADD_CONTACTS_ROUTE,
  BUNDLES_ROUTE,
  CONTACT_GROUPS_ROUTE,
  CONTACTS_ROUTE,
  IMPORT_CONTACTS_ROUTE,
  MANAGE_TEAM_ROUTE,
  ORDERS_ROUTE,
  REPORTS_ROUTE,
  USER_ROUTE
} from '../'
import OrdersIcon from '../../static/orders.svg'
import ContactsIcon from '../../static/book.svg'
import ReportsIcon from '../../static/reports.svg'
import ManageTeamIcon from '../../static/manage_team.svg'
import BundlesIcon from '../../static/shopping_bag.svg'
import SettingsIcon from '../../static/settings.svg'

class Dashboard extends React.Component {
  render() {
    const {children} = this.props
    return (
      <div className={s.container}>
        <Menu className={s.menu} mode='inline'>
          <Menu.Item key={ORDERS_ROUTE}>
            <Link to={ORDERS_ROUTE}>
              <OrdersIcon/>
              Orders
            </Link>
          </Menu.Item>
          <Menu.Item key={BUNDLES_ROUTE}>
            <Link to={BUNDLES_ROUTE}>
              <BundlesIcon/>
              Bundles
            </Link>
          </Menu.Item>
          <Menu.SubMenu
            className={s.subMenu}
            title={
              <React.Fragment>
                <ContactsIcon/>
                Contacts
              </React.Fragment>
            }
          >
            <Menu.Item key={CONTACTS_ROUTE}>
              <Link to={CONTACTS_ROUTE}>
                Find Contacts
              </Link>
            </Menu.Item>
            <Menu.Item key={IMPORT_CONTACTS_ROUTE}>
              <Link to={IMPORT_CONTACTS_ROUTE}>
                Import Contacts
              </Link>
            </Menu.Item>
            <Menu.Item key={ADD_CONTACTS_ROUTE}>
              <Link to={ADD_CONTACTS_ROUTE}>
                New Contact
              </Link>
            </Menu.Item>
            <Menu.Item key={CONTACT_GROUPS_ROUTE}>
              <Link to={CONTACT_GROUPS_ROUTE}>
                Groups
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key={REPORTS_ROUTE}>
            <Link to={REPORTS_ROUTE}>
              <ReportsIcon/>
              Reports
            </Link>
          </Menu.Item>
          <Menu.Item key={MANAGE_TEAM_ROUTE}>
            <Link to={MANAGE_TEAM_ROUTE}>
              <ManageTeamIcon/>
              Manage Team
            </Link>
          </Menu.Item>
          <Menu.Item key={USER_ROUTE}>
            <Link to={USER_ROUTE}>
              <SettingsIcon/>
              Settings
            </Link>
          </Menu.Item>
        </Menu>
        <div className={s.content}>
          <div className={s.breadcrumbsWrapper}>
            <div className={s.breadcrumbs}>Breadcrumbs</div>
          </div>
          {children}
        </div>
      </div>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Dashboard))
