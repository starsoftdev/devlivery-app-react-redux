import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './PurchaseCompleted.css'
import {Link} from '../../components'
import CompletedIcon from '../../static/checked_badge.svg'
import {HOME_ROUTE} from '../'

class PurchaseCompleted extends React.Component {
  render() {
    return (
      <div className={s.container}>
        <CompletedIcon className={s.completedIcon}/>
        <h1 className={s.header}>Thank You</h1>
        <p className={s.description}>
          Your order is complete. If you want to see track your gift, you can control it from your Personal Account.
          <br/>
          Create in 4 simple steps!
        </p>
        <Link to={HOME_ROUTE} className={s.dashboardBtn}>
          <Button type='primary'>Dashboard</Button>
        </Link>
      </div>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(PurchaseCompleted))
