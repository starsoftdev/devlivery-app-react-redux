import React from 'react'
import {connect} from 'react-redux'
import {PAYPAL, CREDIT_CARD, setPaymentMethod, submitPaymentMethod} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase12.css'
import {Actions, Card, SectionHeader} from '../../components'
import PayPalIcon from '../../static/paypal.svg'
import CreditCardIcon from '../../static/credit_card.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'

class Purchase12 extends React.Component {
  render() {
    const {paymentMethod, setPaymentMethod, submitPaymentMethod, flowIndex} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={'Select Payment Method'}
            number={flowIndex}
            prefixClassName={s.headerPrefix}
          />
          <Row className={s.items} gutter={20} type='flex' align='center'>
            <Col className={s.itemWrapper}>
              <Card
                className={s.item}
                title={'PayPal'}
                onClick={() => setPaymentMethod(PAYPAL)}
                active={paymentMethod === PAYPAL}
                keyValue='a'
                svg={PayPalIcon}
              />
            </Col>
            <Col className={s.itemWrapper}>
              <Card
                className={s.item}
                title={'Credit Card'}
                onClick={() => setPaymentMethod(CREDIT_CARD)}
                active={paymentMethod === CREDIT_CARD}
                keyValue='b'
                svg={CreditCardIcon}
              />
            </Col>
          </Row>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={submitPaymentMethod}
          />
          <Button
            onClick={submitPaymentMethod}
            type='primary'
            disabled={!paymentMethod}
          >
            Submit
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  paymentMethod: state.purchase.paymentMethod,
})

const mapDispatch = {
  setPaymentMethod,
  submitPaymentMethod,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase12))
