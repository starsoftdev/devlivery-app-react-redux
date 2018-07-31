import React from 'react'
import {connect} from 'react-redux'
import {
  CREDIT_CARD,
  BITPAY,
  PAYPAL,
  nextFlowStep,
  makeStripePayment,
  makeBitpayPayment,
  makePaypalPayment,
} from '../../reducers/purchase'
import {Button, Col, Form, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase13.css'
import {Actions, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import ReactCreditCard from 'react-credit-cards'
import creditCardStyles from 'react-credit-cards/es/styles-compiled.css'
import messages from './messages'

// TODO add validation for cards 'payment' library
class Purchase13 extends React.Component {
  state = {
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focused: '',
  }

  componentDidMount() {
    switch (this.props.paymentMethod) {
      case PAYPAL:
        this.props.makePaypalPayment()
        this.props.nextFlowStep()
        break

      case BITPAY:
        this.props.makeBitpayPayment()
        this.props.nextFlowStep()
        break
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // TODO validate card fields
        const card = {
          ...values,
          expiry_month: values.expiry.slice(0, 2),
          expiry_year: `20${values.expiry.slice(-2)}`,
        }

        switch (this.props.paymentMethod) {
          case CREDIT_CARD:
            this.props.makeStripePayment(card)
            break

          default:
            this.props.nextFlowStep()
            break
        }
      }
    })
  }

  handleInputChange = (e, field) => {
    if (field === 'number') {
      this.setState({
        [field]: e.target.value.replace(/ /g, ''),
      })
    }
    else if (field === 'expiry') {
      this.setState({
        [field]: e.target.value.replace(/ |\//g, ''),
      })
    }
    else {
      this.setState({
        [field]: e.target.value,
      })
    }
  }

  handleInputFocus = (e, field) => {
    this.setState({
      focused: field,
    })
  }

  render() {
    const {number, name, expiry, cvc, focused} = this.state
    const {flowIndex, intl} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <Row gutter={20} type='flex' align='middle'>
            <Col xs={24} sm={12}>
              <ReactCreditCard
                number={number}
                name={name}
                expiry={expiry}
                cvc={cvc}
                focused={focused}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Form>
                <Form.Item>
                  {getFieldDecorator('number', {
                  })(
                    <Input
                      placeholder={intl.formatMessage(messages.number)}
                      onChange={(e) => this.handleInputChange(e, 'number')}
                      onFocus={(e) => this.handleInputFocus(e, 'number')}
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('name', {
                  })(
                    <Input
                      placeholder={intl.formatMessage(messages.name)}
                      onChange={(e) => this.handleInputChange(e, 'name')}
                      onFocus={(e) => this.handleInputFocus(e, 'name')}
                    />
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={16}>
                    <Form.Item>
                      {getFieldDecorator('expiry', {
                      })(
                        <Input
                          placeholder={intl.formatMessage(messages.expiry)}
                          onChange={(e) => this.handleInputChange(e, 'expiry')}
                          onFocus={(e) => this.handleInputFocus(e, 'expiry')}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={8}>
                    <Form.Item>
                      {getFieldDecorator('cvc', {
                      })(
                        <Input
                          placeholder={intl.formatMessage(messages.cvc)}
                          onChange={(e) => this.handleInputChange(e, 'cvc')}
                          onFocus={(e) => this.handleInputFocus(e, 'cvc')}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button
            onClick={this.handleSubmit}
            type='primary'
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  paymentMethod: state.purchase.paymentMethod,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  nextFlowStep,
  makeStripePayment,
  makeBitpayPayment,
  makePaypalPayment,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s, creditCardStyles)(Purchase13)))
