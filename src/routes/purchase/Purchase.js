import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase.css'

class Purchase extends React.Component {
  render() {
    const {children, intl} = this.props

    return (
      <React.Fragment>
        <div className={s.content}>
          {children}
        </div>
        <div className={s.actions}>
        </div>
      </React.Fragment>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase))
