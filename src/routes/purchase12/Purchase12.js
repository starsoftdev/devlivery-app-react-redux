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

class Purchase12 extends React.Component {
  setPaymentMethod = (paymentMethod) => {
    this.props.setPaymentMethod(paymentMethod)
  }

  render() {
    const {paymentMethod, flowIndex,intl} = this.props
    return (
      <div className={s.content}>
        <SectionHeader
          header={'Select Payment Method'}
          number={flowIndex + 1}
          prefixClassName={s.headerPrefix}
        />
        <Row className={s.items} gutter={20} type='flex' align='center'>
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={'PayPal'}
              onClick={() => this.setPaymentMethod(PAYPAL)}
              active={paymentMethod === PAYPAL}
              keyValue='a'
              svg={PayPalIcon}
            />
          </Col>
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={'Credit Card'}
              onClick={() => this.setPaymentMethod(CREDIT_CARD)}
              active={paymentMethod === CREDIT_CARD}
              keyValue='b'
              svg={CreditCardIcon}
            />
          </Col>
          <Col className={s.itemWrapper}>
            <Card
              className={s.item}
              title={'BitPay'}
              onClick={() => this.setPaymentMethod(BITPAY)}
              active={paymentMethod === BITPAY}
              keyValue='c'
              svg={CreditCardIcon}
            />
          </Col>
        </Row>
        <PurchaseActions>
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
        </PurchaseActions>
      </div>
    )
  }
}

const mapState = state => ({
  paymentMethod: state.purchase.paymentMethod,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  setPaymentMethod,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase12))
