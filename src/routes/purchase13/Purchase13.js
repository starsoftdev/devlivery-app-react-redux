import React from 'react'
import {connect} from 'react-redux'
import {PAYPAL, CREDIT_CARD, setPaymentMethod, submitPayment} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase13.css'
import {Actions, Card, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'

class Purchase13 extends React.Component {
  render() {
    const {submitPayment} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={'Credit Card Information'}
            number={13}
            prefixClassName={s.headerPrefix}
          />
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={submitPayment}
          />
          <Button
            onClick={submitPayment}
            type='primary'
          >
            Pay
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
})

const mapDispatch = {
  submitPayment,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase13))
