import React from 'react'
import {connect} from 'react-redux'
import {BITPAY, CREDIT_CARD, nextFlowStep, PAYPAL, setPaymentMethod} from '../../reducers/purchase'
import {Col, Row, Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase12.css'
import {Card, SectionHeader, PurchaseActions} from '../../components'
import PayPalIcon from '../../static/paypal.svg'
import CreditCardIcon from '../../static/credit_card.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import {isHavePaymentPermission} from '../../utils';

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
    const {paymentMethod, flowIndex,intl} = this.props
    const {payment_permission,msg} = this.state;
    
    return (
      <div className={s.content}>
        <SectionHeader
          header={intl.formatMessage(messages.purchase12)}
          number={flowIndex + 1}
          prefixClassName={s.headerPrefix}
        />
        {payment_permission === null && <h3 style={{color:'red'}}>{msg}</h3>}
        <Row className={s.items} gutter={20} type='flex' align='center'>
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={'PayPal'}
              onClick={() => this.setPaymentMethod(PAYPAL)}
              active={paymentMethod === PAYPAL && payment_permission}
              keyValue='a'
              svg={PayPalIcon}
              disabled = {payment_permission === null}
            />
          </Col>
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={'Credit Card'}
              onClick={() => this.setPaymentMethod(CREDIT_CARD)}
              active={paymentMethod === CREDIT_CARD && payment_permission}
              keyValue='b'
              svg={CreditCardIcon}
              disabled = {payment_permission === null}
            />
          </Col>
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={'BitPay'}
              onClick={() => this.setPaymentMethod(BITPAY)}
              active={paymentMethod === BITPAY && payment_permission}
              keyValue='c'
              svg={CreditCardIcon}
              disabled = {payment_permission === null}
            />
          </Col>
        </Row>
        <PurchaseActions>
          {/*
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => paymentMethod && this.props.nextFlowStep()}
          />
          <Button
            type='primary'
            disabled={!paymentMethod}
            onClick={() => this.props.nextFlowStep()}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
          */}
        </PurchaseActions>
      </div>
    )
  }
}

const mapState = state => ({
  paymentMethod: state.purchase.paymentMethod,
  flowIndex: state.purchase.flowIndex,
  user_permissions: state.permission.user_permissions,
})

const mapDispatch = {
  setPaymentMethod,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase12))
