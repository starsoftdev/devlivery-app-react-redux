import React from 'react'
import {connect} from 'react-redux'
import {BITPAY, CREDIT_CARD, nextFlowStep, PAYPAL, INVOICE,setPaymentMethod} from '../../reducers/purchase'
import {Col, Row, Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase12.css'
import {Card, SectionHeader, PurchaseActions} from '../../components'
import PayPalIcon from '../../static/paypal.svg'
import CreditCardIcon from '../../static/credit_card.svg'
import InvoiceIcon from '../../static/invoice.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import {isHavePaymentPermission} from '../../utils';
import {INDIVIDUAL_ACCOUNT} from '../../reducers/register';

class Purchase12 extends React.Component {
  state = {
    payment_permission: null,
    msg:''
  }
  setPaymentMethod = (paymentMethod) => {
    this.props.setPaymentMethod(paymentMethod)
    this.props.nextFlowStep()
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops && nextprops.user_permissions) {
      if (nextprops.user_permissions.hasOwnProperty('Payments')) {
        const checkpermission = isHavePaymentPermission(nextprops.user_permissions);
        this.setState({ payment_permission: checkpermission, msg: checkpermission ? '':'You have no payment permission.'});
      }
      else this.setState({msg:'You have no payment permission.'});
    }
  }
  render() {
    const {paymentMethod, flowIndex,intl, user} = this.props
    const {payment_permission,msg} = this.state;
    const havePermission  = user && user.account_type === INDIVIDUAL_ACCOUNT ? true : payment_permission === null ? false : true;
    const handwrittenDisabled = !(user && user.is_subscribed);
    
    return (
      <div className={s.content}>
        <SectionHeader
          header={intl.formatMessage(messages.purchase12)}
          number={flowIndex + 1}
          prefixClassName={s.headerPrefix}
        />
        {!havePermission && <h3 style={{color:'red'}}>{msg}</h3>}
        <Row className={s.items} gutter={20} type='flex' align='center'>
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={'PayPal'}
              onClick={() => this.setPaymentMethod(PAYPAL)}
              active={paymentMethod === PAYPAL && havePermission}
              keyValue='a'
              svg={PayPalIcon}
              disabled = {!havePermission}
            />
          </Col>
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={intl.formatMessage(messages.creditcard)}
              onClick={() => this.setPaymentMethod(CREDIT_CARD)}
              active={paymentMethod === CREDIT_CARD && havePermission}
              keyValue='b'
              svg={CreditCardIcon}
              disabled = {!havePermission}
            />
          </Col>
          {/*
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={'BitPay'}
              onClick={() => this.setPaymentMethod(BITPAY)}
              active={paymentMethod === BITPAY && havePermission}
              keyValue='c'
              svg={CreditCardIcon}
              disabled = {!havePermission}
            />
          </Col>
          */}
          {/*
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={'OFFICE-INVOICE'}
              onClick={() => this.setPaymentMethod(INVOICE)}
              active={paymentMethod === INVOICE && havePermission}
              keyValue='d'
              svg={InvoiceIcon}
              disabled = {!havePermission || handwrittenDisabled}
            />
          </Col>
          */}
        </Row>
        <PurchaseActions>
          
        </PurchaseActions>
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user.user,
  paymentMethod: state.purchase.paymentMethod,
  flowIndex: state.purchase.flowIndex,
  user_permissions: state.permission.user_permissions,
})

const mapDispatch = {
  setPaymentMethod,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase12))
