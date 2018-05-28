import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Layout.css'
import {Footer, Header} from '../../components'
import {Layout} from 'antd'
import antdStyles from 'antd/dist/antd.min.css'
import globalStyles from '../../global.css'

class AppLayout extends React.Component {
  render() {
    return (
      <Layout className={s.container}>
        <Header/>
        <Layout.Content className={s.content}>
          {this.props.children}
        </Layout.Content>
        <Footer/>
      </Layout>
    )
  }
}

const mapState = (state) => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(
  antdStyles,
  globalStyles,
  s,
)(AppLayout))
