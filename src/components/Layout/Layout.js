import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Layout.css'
import {Header} from '../../components'
import {Layout} from 'antd'
import gridStyles from 'antd/lib/grid/style/index.css'
import formStyles from 'antd/lib/form/style/index.css'
import globalStyles from '../../styles/global.css'

class AppLayout extends React.Component {
  render() {
    return (
      <Layout className={s.container}>
        <Header/>
        <main className={s.content}>
          {this.props.children}
        </main>
      </Layout>
    )
  }
}

const mapState = (state) => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(
  gridStyles,
  formStyles,
  globalStyles,
  s,
)(AppLayout))
