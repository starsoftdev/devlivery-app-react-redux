import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './PurchaseCompleted.css'
import {Link} from '../../components'
import CompletedIcon from '../../static/checked_badge.svg'
import {ORDERS_ROUTE} from '../'
import messages from './messages'

class PurchaseCompleted extends React.Component {
  render() {
    const {intl} = this.props;
    return (
      <div className={s.container}>
        <CompletedIcon className={s.completedIcon}/>
        <h1 className={s.header}>{intl.formatMessage(messages.thankyou)}</h1>
        <p className={s.description}>
          {intl.formatMessage(messages.thankyou_text)}
          <br/>
          {/*intl.formatMessage(messages.thankyou_shorttext)*/}
        </p>
        <Link to={ORDERS_ROUTE} className={s.dashboardBtn}>
          <Button type='primary'>{this.props.intl.formatMessage(messages.dashboard)}</Button>
        </Link>
      </div>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(PurchaseCompleted))
