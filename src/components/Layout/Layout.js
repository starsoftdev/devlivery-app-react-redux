import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Layout.css'
import {Footer, Header} from '../../components'
import {Layout} from 'antd'
import gridStyles from 'antd/lib/grid/style/index.css'
import formStyles from 'antd/lib/form/style/index.css'
import alertStyles from 'antd/lib/alert/style/index.css'
import messageStyles from 'antd/lib/message/style/index.css'
import globalStyles from '../../styles/global.css'
import {
  ADD_CONTACTS_ROUTE, CONTACT_GROUPS_ROUTE,
  CONTACTS_ROUTE,
  HOME_ROUTE,
  IMPORT_CONTACTS_ROUTE,
  MANAGE_TEAM_ROUTE,
  ORDERS_ROUTE,
  REPORTS_ROUTE
} from '../../routes'

class AppLayout extends React.Component {
  static defaultProps = {
    header: true,
  }

  render() {
    const {currentRouteName, header} = this.props
    return (
      <Layout className={s.container}>
        {header && <Header/>}
        <main className={s.content}>
          {this.props.children}
        </main>
        {[
          HOME_ROUTE,
          ORDERS_ROUTE,
          CONTACTS_ROUTE,
          ADD_CONTACTS_ROUTE,
          IMPORT_CONTACTS_ROUTE,
          REPORTS_ROUTE,
          MANAGE_TEAM_ROUTE,
          CONTACT_GROUPS_ROUTE,
        ].includes(currentRouteName) && <Footer/>}
      </Layout>
    )
  }
}

const mapState = (state) => ({
  currentRouteName: state.global.currentRouteName,
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(
  gridStyles,
  formStyles,
  alertStyles,
  messageStyles,
  globalStyles,
  s,
)(AppLayout))
