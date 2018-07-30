import React from 'react'
import {connect} from 'react-redux'
import {AppLayout} from '../../components'
import {executePaypalPayment, cancelPaypalPayment} from '../../reducers/purchase'

class PaypalRedirectBack extends React.PureComponent {
  componentDidMount() {
    if (this.props.cancel) {
      this.props.cancelPaypalPayment()
    } else {
      const query = new URLSearchParams(window.location.search)
      const paymentId = query.get('paymentId')
      const paypalToken = query.get('token')
      const payerId = query.get('PayerID')

      this.props.executePaypalPayment({paymentId, paypalToken, payerId})
    }
  }

  render() {
    return <AppLayout />
  }
}

const mapDispatch = {
  executePaypalPayment,
  cancelPaypalPayment,
}

export default connect(null, mapDispatch)(PaypalRedirectBack)
