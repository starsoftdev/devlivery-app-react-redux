import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase.css'
import {PurchaseActions} from '../../components'

class Purchase extends React.Component {
  static defaultProps = {
    actions: true,
  }

  render() {
    const {children, actions} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          {children}
        </div>
        {actions && <PurchaseActions/>}
      </React.Fragment>
    )
  }
}

const mapState = state => ({
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase))
