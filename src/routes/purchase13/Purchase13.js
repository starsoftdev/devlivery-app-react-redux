import React from 'react'
import { connect } from 'react-redux'
import {
  CREDIT_CARD,
  BITPAY,
  PAYPAL,
  nextFlowStep,
  InvoiceIcon,
  makeStripePayment,
  makeBitpayPayment,
  makePaypalPayment,
  makeInvoicePayment,
  makeDefaultStripePayment,
  INVOICE
} from '../../reducers/purchase'
import { Button, Col, Form, Input, Row, Spin, Icon, message, Checkbox } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase13.css'
import { PurchaseActions, SectionHeader, CardCheckOut } from '../../components'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import ReactCreditCard from 'react-credit-cards'
import creditCardStyles from 'react-credit-cards/es/styles-compiled.css'
import messages from './messages'
import { FloatingLabel } from '../../components';

// TODO add validation for cards 'payment' library
class Purchase13 extends React.Component {
  state = {
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focused: '',
    requirmsg: null,
    isValid: false,
    showMark: false,
    cardtype: null,
    useDefualtCard: false
  }
  constructor(props) {
    super(props)
    this.handleCallback = this.handleCallback.bind(this);
    this.handleBlurCardNumber = this.handleBlurCardNumber.bind(this);
  }
  componentDidMount() {

    switch (this.props.paymentMethod) {
      case CREDIT_CARD: {
        Payment.formatCardNumber(document.querySelector('input.cardnumber'));
        Payment.formatCardExpiry(document.querySelector('input.cardexpire'));
        Payment.formatCardCVC(document.querySelector('input.cardcvc'));
        break;
      }
      case PAYPAL:
        this.props.makePaypalPayment()
        // this.props.nextFlowStep()
        break

      case BITPAY:
        this.props.makeBitpayPayment()
        // this.props.nextFlowStep()
        break
      case INVOICE:
        this.props.makeInvoicePayment()
        // this.props.nextFlowStep()
        break
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    /*
    if (this.state.useDefualtCard && this.props.paymentMethod === CREDIT_CARD) {
      var defaultcard = this.props.cards.filter(item => item.default);
      if(defaultcard.length > 0)
      {
        this.props.makeDefaultStripePayment(defaultcard[0].id);
      }
    }
    else{
      this.props.form.validateFields((err, values) => {
        if (values.number && values.name && values.expiry && values.cvc) {
          if (!err && this.state.isValid) {
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
        } else {
          message.error('All fields must be filled in')
        }
      })
    }
    */
    this.props.form.validateFields((err, values) => {
      if (values.number && values.name && values.expiry && values.cvc) {
        if (!err && this.state.isValid) {
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
        else this.payWithDefaultCard();
      } else {
        this.payWithDefaultCard();
        //message.error('All fields must be filled in')
      }
    })
  }
  payWithDefaultCard(){
    if (this.props.paymentMethod === CREDIT_CARD) {
      var defaultcard = this.props.cards.filter(item => item.default);
      if(defaultcard.length > 0)
      {
        this.props.makeDefaultStripePayment(defaultcard[0].id);
      }
      else message.error('All fields must be filled in')
    }
  }
  handleInputChange = (e, field) => {
    if (field === 'number') {
      this.setState({
        [field]: e.target.value.replace(/ /g, ''),
        showMark: false
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
  handleBlurCardNumber = () => {
    this.setState({ showMark: true });
  }
  handleInputFocus = (e, field) => {
    this.setState({
      focused: field,
    })
  }

  validation = (field, length) => {
    if (field.length === length) {
      return {
        status: 'success'
      }
    }
    return {
      status: 'error',
      help: 'required'
    }
  }
  handleCallback(type, isValid) {
    if (type && type.issuer == 'unknown' || !isValid) {
      this.setState({ requirmsg: 'Invalid credit card number', isValid });
    } else this.setState({ requirmsg: null, isValid, cardtype: type.issuer });
  }
  render() {
    const { number, name, expiry, cvc, focused } = this.state
    const { flowIndex, intl, cards } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <React.Fragment>
        {this.props.paymentMethod !== CREDIT_CARD &&
          <div className={s.loadingScreen}>
            <Spin
              wrapperClassName='action-spin'
              indicator={<Icon style={{ fontSize: '16px' }} spin type='loading' />}
              spinning={this.props.loading}
            />
          </div>
        }

        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <div className={s.CardCheckOut}>
            {
              cards && cards.length > 0 &&
              <CardCheckOut cards={cards} intl={intl}/>
            }
          </div>
          {
            <Row gutter={20} type='flex' align='middle' className={s.visible/*!this.state.useDefualtCard && cards.length < 4 ? s.visible:s.invisible*/}>
              <Col xs={24} sm={12}>
                <ReactCreditCard
                  number={number}
                  name={name}
                  expiry={expiry}
                  cvc={cvc}
                  focused={focused}
                  callback={this.handleCallback}
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
                        onBlur={() => this.handleBlurCardNumber()}
                        className={'cardnumber'}
                      />
                    )}
                  </Form.Item>
                  {
                    this.state.showMark && this.state.requirmsg && this.props.form.getFieldValue('number') &&
                    <h4 className={s.requireMark}>{this.state.requirmsg}</h4>
                  }
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
                    <Col xs={12}>
                      <Form.Item
                      //{...this.validation(this.state.expiry, 4)}
                      >
                        {getFieldDecorator('expiry', {
                        })(
                          <Input
                            placeholder={intl.formatMessage(messages.expiry)}
                            onChange={(e) => this.handleInputChange(e, 'expiry')}
                            onFocus={(e) => this.handleInputFocus(e, 'expiry')}
                            className={'cardexpire'}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item
                      //{...this.validation(this.state.cvc, 3)}
                      >
                        {getFieldDecorator('cvc', {
                        })(
                          <Input
                            placeholder={intl.formatMessage(messages.cvc)}
                            onChange={(e) => this.handleInputChange(e, 'cvc')}
                            onFocus={(e) => this.handleInputFocus(e, 'cvc')}
                            className={'cardcvc'}
                            maxLength={this.state.cardtype === 'amex' ? 4 : 3}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          }
          <br/>
          <div className={s.checkbox}>
            {/*
              cards && cards.length > 0 &&
              <Checkbox checked={this.state.useDefualtCard || cards.length >= 4} onChange={(e) => {
                this.setState({ useDefualtCard: e.target.checked })
              }
              }>
                Use this card as default from now on
            </Checkbox>
            */
            }
          </div>
        </div>
        <PurchaseActions>
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
        </PurchaseActions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  paymentMethod: state.purchase.paymentMethod,
  flowIndex: state.purchase.flowIndex,
  loading: state.purchase.loading.payment,
  cards: state.user.cards
})

const mapDispatch = {
  nextFlowStep,
  makeStripePayment,
  makeBitpayPayment,
  makePaypalPayment,
  makeInvoicePayment,
  makeDefaultStripePayment
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s, creditCardStyles)(Purchase13)))
