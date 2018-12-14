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
import PlusIcon from '../../static/plus.svg'
import { addCard } from '../../reducers/user'
import Loader from 'react-loader';

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
    user_newcard: false,
    processing: false,
    saveButton: false,
  }
  constructor(props) {
    super(props)
    this.handleCallback = this.handleCallback.bind(this);
    this.handleBlurCardNumber = this.handleBlurCardNumber.bind(this);
    this.handleAddCardButton = this.handleAddCardButton.bind(this)
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
  handleAddCardButton() {
    if (this.state.processing)
      return;
    if (!this.state.saveButton) {
      this.setState({ saveButton: true });
      return
    }
    this.resetCardInfo();
    this.setState({ saveButton: false });
  }
  resetCardInfo() {
    if (this.number) this.number.input.value = '';
    if (this.name) this.name.input.value = '';
    if (this.expiry) this.expiry.input.value = '';
    if (this.cvc) this.cvc.input.value = '';
    this.setState({
      number: '',
      name: '',
      expiry: '',
      cvc: '',
    });
    this.props.form.setFieldsValue({
      number: '',
      name: '',
      expiry: '',
      cvc: '',
    });
  }
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.processing)
      return;
    if (!this.state.saveButton && this.props.paymentMethod === CREDIT_CARD) {
      var defaultcard = this.props.cards.filter(item => item.default);
      if (defaultcard.length > 0) {
        this.setState({ processing: true });
        this.props.makeDefaultStripePayment(defaultcard[0].id, (data) => {
          this.setState && this.setState({ processing: false, saveButton:false });
        });
      }
      else {
        message.info(this.props.intl.formatMessage(messages.msg_addcard))
      }
    }
    else {
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
                {
                  this.setState({ processing: true });
                  this.props.makeStripePayment(card, true, (data) => {
                    this.setState && this.setState({ processing: false, saveButton:false });
                  })
                  break
                }
              default:
                this.props.nextFlowStep()
                break
            }
          }
        } else {
          message.info(this.props.intl.formatMessage(messages.msg_filledin))
        }
      })
    }
  }
  payWithDefaultCard() {
    if (this.props.paymentMethod === CREDIT_CARD) {
      var defaultcard = this.props.cards.filter(item => item.default);
      if (defaultcard.length > 0) {
        this.props.makeDefaultStripePayment(defaultcard[0].id);
      }
      else message.info(this.props.intl.formatMessage(messages.msg_filledin))
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
      this.setState({ requirmsg: this.props.intl.formatMessage(messages.msg_invalidcard), isValid });
    } else this.setState({ requirmsg: null, isValid, cardtype: type.issuer });
  }
  render() {
    const { number, name, expiry, cvc, focused } = this.state
    const { flowIndex, intl, cards, order,loading } = this.props
    const { getFieldDecorator } = this.props.form

    const disable_checkbox = cards && cards.length >= 4;
    if(this.props.paymentMethod !== CREDIT_CARD)
      return (
        <div className={s.loadingScreen}>
          <Loader loaded={this.props.loading ? false: true} position="relative" top="50px"/> 
          <PurchaseActions></PurchaseActions>
        </div>
      );
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <div className={s.checkbox}>
            <label>
              <span className={s.subtotalHeader}>{intl.formatMessage(messages.amount) + ': '}</span>
              <span className={s.subtotalCurrency}>{'CHF'}</span>
              <span className={s.subtotalValue}>{order && order.total}</span>
            </label>
          </div>
          <br />
          <div className={s.CardCheckOut}>
            <CardCheckOut cards={cards} intl={intl} disableDefaultCard={this.state.processing || this.state.saveButton} loading = {loading.cards}/>
          </div>
          <div className={s.checkbox}>
            {
              !disable_checkbox &&
              <Button disabled={this.state.processing} type='primary' ghost size={'small'} className={s.addcardbtn} onClick={this.handleAddCardButton}>
                <PlusIcon />
                {intl.formatMessage(messages.addcard)}
              </Button>
            }
          </div>
          <br />
          {
            <Row gutter={20} type='flex' align='middle' className={!disable_checkbox && this.state.saveButton === true ? s.visible : s.invisible}>
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
                        ref={ref => this.number = ref}
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
                        ref={ref => this.name = ref}
                        placeholder={intl.formatMessage(messages.name)}
                        onChange={(e) => this.handleInputChange(e, 'name')}
                        onFocus={(e) => this.handleInputFocus(e, 'name')}
                      />
                    )}
                  </Form.Item>
                  <Row gutter={20}>
                    <Col xs={12}>
                      <Form.Item
                      >
                        {getFieldDecorator('expiry', {
                        })(
                          <Input
                            ref={ref => this.expiry = ref}
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
                      >
                        {getFieldDecorator('cvc', {
                        })(
                          <Input
                            ref={ref => this.cvc = ref}
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
        </div>
        <PurchaseActions>
          <Loader loaded={!this.state.processing} top='-50px'> 
            <KeyHandler
              keyEventName={KEYPRESS}
              keyCode={13}
              onKeyHandle={this.handleSubmit}
            />
            <Button
              disabled={this.state.processing}
              onClick={this.handleSubmit}
              type='primary'
            >
              {intl.formatMessage(messages.submit)}
            </Button>
          </Loader>
        </PurchaseActions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  paymentMethod: state.purchase.paymentMethod,
  flowIndex: state.purchase.flowIndex,
  loading: state.purchase.loading.payment,
  cards: state.user.cards,
  order: state.purchase.order,
  loading: state.user.loading
})

const mapDispatch = {
  nextFlowStep,
  makeStripePayment,
  makeBitpayPayment,
  makePaypalPayment,
  makeInvoicePayment,
  makeDefaultStripePayment,
  addCard
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s, creditCardStyles)(Purchase13)))
