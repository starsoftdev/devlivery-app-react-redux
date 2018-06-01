import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Layout.css'
import {Footer, Header} from '../../components'
import {Layout} from 'antd'
import gridStyles from 'antd/lib/grid/style/index.css'
import formStyles from 'antd/lib/form/style/index.css'
import alertStyles from 'antd/lib/alert/style/index.css'
import globalStyles from '../../styles/global.css'
import {HOME_ROUTE} from '../../routes'

class AppLayout extends React.Component {
  render() {
    const {currentRouteName} = this.props
    return (
      <Layout className={s.container}>
        <Header/>
        <main className={s.content}>
          {this.props.children}
        </main>
        {[HOME_ROUTE].includes(currentRouteName) && <Footer/>}
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
  globalStyles,
  s,
)(AppLayout))
