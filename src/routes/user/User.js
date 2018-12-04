import React from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Col, DatePicker, Form, Input, Row, Select,Modal } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './User.css'
import formMessages from '../../formMessages'
import moment from 'moment'
import PlusIcon from '../../static/plus.svg'
import { DATE_FORMAT } from '../../constants'
import { ChangePasswordForm } from '../../components'
import { updateUser, getAllCards, addCard, setChangingStatusSetting } from '../../reducers/user'
import messages from './messages'
import { FloatingLabel, CardCheckOut, Avatar } from '../../components';
import ReactCreditCard from 'react-credit-cards'
import creditCardStyles from 'react-credit-cards/es/styles-compiled.css'
import { makeStripePayment } from '../../reducers/purchase'
import { TEAM_ACCOUNT } from '../../reducers/register'
import Cleave from 'cleave.js/react';
import { setNextRouteName, navigateToNextRouteName } from '../../reducers/global';

class User extends React.Component {
  state = {
    visible: false,
    nextPathname: null,
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focused: '',
    requirmsg: null,
    isValid: false,
    showMark: false,
    cardtype: null,
    saveButton: false,
    processing: false
  }
  constructor(props) {
    super(props)
    this.handleCallback = this.handleCallback.bind(this);
    this.handleBlurCardNumber = this.handleBlurCardNumber.bind(this);
    this.handleAddCardButton = this.handleAddCardButton.bind(this);
    this.resetCardInf = this.resetCardInf.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.global && nextProps.global.nextPathname && !this.state.visible) {
      if (nextProps.changedSetting) {
        this.setState({ visible: true, nextPathname: nextProps.global.nextPathname });
        this.props.setNextRouteName(null);
      }
      else {
        this.props.setNextRouteName(null);
        this.props.navigateToNextRouteName(nextProps.global.nextPathname);
      }
    }
  }
  componentDidMount() {
    Payment.formatCardNumber(document.querySelector('input.cardnumber'));
    Payment.formatCardExpiry(document.querySelector('input.cardexpire'));
    Payment.formatCardCVC(document.querySelector('input.cardcvc'));
  }
  handleSubmit = (e) => {
    if(e)
      e.preventDefault()
    this.props.form.validateFields((err, values) => {
      var dobValidation = false;
      var birthday = moment(values.birthday, 'DD/MM/YYYY');
      var expected = moment().subtract(18, 'years');
      if (birthday.isValid() && values.birthday.length === 10) {
        if (birthday < expected)
          dobValidation = true;
        else {
          this.props.form.setFields({
            birthday: {
              value: values.birthday,
              errors: [new Error('please select date older than 18 years.')],
            },
          });
        }
      } else {
        if (values.birthday && values.birthday.length > 0)
          this.props.form.setFields({
            birthday: {
              value: values.birthday,
              errors: [new Error('Invalid Date Format.')],
            },
          });
      }
      if (!err && dobValidation) {
        this.props.updateUser(values, this.props.form, this.props.intl.locale === "de-DE" ? 'Angaben angepasst' : 'User updated.', e ? null : this.state.nextPathname)
      }
    })
  }

  handleAddCardButton = () => {

    if (this.state.processing)
      return;
    if (!this.state.saveButton) {
      this.setState({ saveButton: true });
      return
    }

    if (this.state.isValid) {
      if (this.state.name.length <= 0) {
        this.setState({ showMark: true, requirmsg: 'please input name.' });
        return;
      }
      if (this.state.expiry < 4) {
        this.setState({ showMark: true, requirmsg: 'Invalid expire date' });
        return;
      }
      if (this.state.cvc < 3) {
        this.setState({ showMark: true, requirmsg: 'Invalid CVC number' });
        return;
      }
      const expiry_month = this.state.expiry.slice(0, 2);
      const expiry_year = this.state.expiry.slice(-(this.state.expiry.length - 2))
      const expriteDate = expiry_month + ' / ' + expiry_year;

      if (!Payment.fns.validateCardExpiry(expriteDate)) {
        this.setState({ showMark: true, requirmsg: 'Invalid expire date' });
        return;
      }
      this.setState({ showMark: false, processing: true });
      this.props.makeStripePayment(
        {
          number: this.state.number,
          expiry_month,
          expiry_year,
          cvc: this.state.cvc,
          ignore: true
        },
        false,
        (data) => {
          if (data && data.id)
            this.props.addCard(data, (success) => {
              this.setState({ processing: false });
              if (success) this.resetCardInf()
            })
          else {
            this.setState({ showMark: true, requirmsg: data.message ? data.message : 'Invalid Card', processing: false });
            return;
          }
        }
      )
    }
    else {
      this.setState({ showMark: true });
    }
  }
  resetCardInf() {
    if (this.number) this.number.input.value = '';
    if (this.name) this.name.input.value = '';
    if (this.expiry) this.expiry.input.value = '';
    if (this.cvc) this.cvc.input.value = '';
    this.setState({
      number: '',
      name: '',
      expiry: '',
      cvc: '',
      focused: '',
      requirmsg: null,
      isValid: false,
      showMark: false,
      cardtype: null,
      saveButton: false,
      processing: false
    });
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

  handleCallback(type, isValid) {
    if (type && type.issuer == 'unknown' || !isValid) {
      this.setState({ requirmsg: 'Invalid credit card number', isValid });
    } else this.setState({ requirmsg: null, isValid, cardtype: type.issuer });
  }
  onOk() {
    this.setState({ visible: false });
    this.handleSubmit();
  }
  onCancel(e) {
    this.setState({ visible: false });
    if(e.target.value !== undefined)
      this.props.navigateToNextRouteName(this.state.nextPathname);
  }
  render() {
    const { number, name, expiry, cvc, focused } = this.state
    const { user, intl, cards, loading } = this.props
    const { getFieldDecorator } = this.props.form

    const handwrittenDisabled = !(user && user.is_subscribed);

    const address = user && user.addresses && user.addresses.find(item => item.default !== null)

    const reminderTimes = [
      { value: 0, label: 'Same Day', label_de: 'Same Day' },
      { value: 1, label: 'Day Before', label_de: '1 Tag vorher' },
      { value: 2, label: '2 Days Before', label_de: '2 Tage vorher' },
      { value: 3, label: '3 Days Before', label_de: '3 Tage vorher' },
      { value: 4, label: '4 Days Before', label_de: '4 Tage vorher' },
      { value: 5, label: '5 Days Before', label_de: '5 Tage vorher' },
      { value: 6, label: '6 Days Before', label_de: '6 Tage vorher' },
      { value: 7, label: '1 week before', label_de: '1 Woche vorher' },
    ]
    return (
      <div className={s.container}>
        <Modal
          title="Confirm"
          visible={this.state.visible}
          onOk={this.onOk}
          onCancel={this.onCancel}
          okText="Yes"
          cancelText="No"
        >
          <h2>Do you wish save the information you've edited?</h2>
        </Modal>
        <div className={s.form}>
          <Row type='flex' gutter={20} className={s.leftColumn}>
            <Col xs={24} md={12}>
              <section className={s.section}>
                <h1 className={s.header}>{intl.formatMessage(messages.personalInf)}</h1>
                <Form.Item>
                  {getFieldDecorator('user.nickname', {
                    initialValue: user && user.nickname ? user.nickname : '',
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.nickname)} />
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('user.first_name', {
                        initialValue: user && user.first_name,
                        rules: [
                          { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                        ],
                      })(
                        <FloatingLabel type="name" placeholder={intl.formatMessage(messages.firstName)} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('user.last_name', {
                        initialValue: user && user.last_name,
                        rules: [
                          { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                        ],
                      })(
                        <FloatingLabel type="name" placeholder={intl.formatMessage(messages.lastName)} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  {getFieldDecorator('user.email', {
                    validateTrigger: 'onBlur',//'onSubmit'
                    initialValue: user && user.email,
                    rules: [
                      { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                      { type: 'email', message: intl.formatMessage(formMessages.emailInvalid) },
                    ],
                  })(
                    <FloatingLabel placeholder={'Email'} />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('user.phone', {
                    initialValue: user && user.phone,
                    rules: [
                      { required: false, message: formMessages.required },
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.phone)} />
                  )}
                </Form.Item>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>{intl.formatMessage(messages.birthday)}</h1>
                <Form.Item>
                  {getFieldDecorator('birthday', {
                    initialValue: user && user.dob ? moment(user.dob).format("DD/MM/YYYY") : undefined,
                    rules: [
                      { required: true, message: intl.formatMessage(formMessages.required) },
                    ],
                  })(
                    <Cleave
                      placeholder={intl.formatMessage(messages.dateplaceholder)}
                      options={{
                        date: true,
                        datePattern: ['d', 'm', 'Y']
                      }}
                    />
                  )}
                </Form.Item>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>{intl.formatMessage(messages.billingdetails)}</h1>
                <div>
                  <CardCheckOut cards={cards} intl={intl} removeable={true} loading={loading.cards} />
                </div>
                <Row gutter={20} type='flex' align='middle' className={this.state.saveButton === true ? s.show : s.hidden}>
                  <Col xs={24} sm={24}>
                    <br />
                    <ReactCreditCard
                      number={number}
                      name={name}
                      expiry={expiry}
                      cvc={cvc}
                      focused={focused}
                      callback={this.handleCallback}
                    />
                    <br />
                  </Col>
                  <Col xs={24} sm={24}>
                    <Input
                      ref={ref => this.number = ref}
                      placeholder={intl.formatMessage(messages.number)}
                      onChange={(e) => this.handleInputChange(e, 'number')}
                      onFocus={(e) => this.handleInputFocus(e, 'number')}
                      onBlur={() => this.handleBlurCardNumber()}
                      className={'cardnumber'}
                    />
                    <Input
                      ref={ref => this.name = ref}
                      placeholder={intl.formatMessage(messages.name)}
                      onChange={(e) => this.handleInputChange(e, 'name')}
                      onFocus={(e) => this.handleInputFocus(e, 'name')}
                    />
                    <Row gutter={20}>
                      <Col xs={16}>
                        <Input
                          ref={ref => this.expiry = ref}
                          placeholder={intl.formatMessage(messages.expiry)}
                          onChange={(e) => this.handleInputChange(e, 'expiry')}
                          onFocus={(e) => this.handleInputFocus(e, 'expiry')}
                          className={'cardexpire'}
                        />
                      </Col>
                      <Col xs={8}>
                        <Input
                          ref={ref => this.cvc = ref}
                          placeholder={intl.formatMessage(messages.cvc)}
                          onChange={(e) => this.handleInputChange(e, 'cvc')}
                          onFocus={(e) => this.handleInputFocus(e, 'cvc')}
                          className={'cardcvc'}
                          maxLength={this.state.cardtype === 'amex' ? 4 : 3}
                        />
                      </Col>
                    </Row>
                    {
                      this.state.showMark && this.state.requirmsg &&
                      <h4 className={s.requireMark}>{this.state.requirmsg}</h4>
                    }
                  </Col>
                </Row>
                {
                  !(cards && cards.length >= 4) &&
                  <Button type='primary' ghost size={'small'} className={s.addcardbtn} onClick={this.handleAddCardButton}>
                    <PlusIcon />
                    {this.state.processing ? 'Adding...' : intl.formatMessage(messages.addcard)}
                  </Button>
                }
              </section>
              <section className={s.section}>
                <h1 className={s.header}>{intl.formatMessage(messages.contactpreference)}</h1>
                <Form.Item className={s.checkboxWrapper}>
                  {getFieldDecorator('preference.notify_on_reminders', {
                    valuePropName: 'checked',
                    initialValue: user && user.preference && user.preference.notify_on_reminders,

                  })(
                    <Checkbox>{intl.formatMessage(messages.checkNotify)}</Checkbox>
                  )}
                </Form.Item>
                <Form.Item className={s.checkboxWrapper}>
                  {getFieldDecorator('preference.receive_promotional_emails', {
                    valuePropName: 'checked',
                    initialValue: user && user.preference && user.preference.receive_promotional_emails,
                  })(
                    <Checkbox>{intl.formatMessage(messages.checkEmail)}</Checkbox>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('preference.remind', {
                    initialValue: user && user.preference ? user.preference.remind : undefined,
                  })(
                    <Select
                      allowClear
                      placeholder={intl.formatMessage(messages.checkPlaceholder)}
                      className={s.select}
                    >
                      {reminderTimes.map((item) =>
                        <Select.Option key={item.value} value={item.value}>{intl.locale === 'de-DE' ? item.label_de : item.label}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </section>
            </Col>
            <Col xs={24} md={12} className={s.rightColumn}>
              <section className={s.section}>
                <h1 className={s.header}>{intl.formatMessage(messages.shipping)}</h1>
                {address && address.id && getFieldDecorator(`address.id`, {
                  initialValue: address.id,
                })(
                  <Input type='hidden' />
                )}
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('address.first_name', {
                        initialValue: address && address.first_name,
                      })(
                        <FloatingLabel type="name" placeholder={intl.formatMessage(messages.firstName)} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('address.last_name', {
                        initialValue: address && address.last_name,
                      })(
                        <FloatingLabel type="name" placeholder={intl.formatMessage(messages.lastName)} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  {getFieldDecorator(`address.company`, {
                    initialValue: address && address.company,
                    rules: [
                      { required: user && user.account_type === TEAM_ACCOUNT ? true : false, min: user && user.account_type === TEAM_ACCOUNT ? 5 : 0, message: intl.formatMessage(formMessages.minLength, { length: 5 }) },
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.company)} />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`address.address`, {
                    initialValue: address && address.address[0],
                    rules: [
                      { required: true, min: 5, message: intl.formatMessage(formMessages.minLength, { length: 5 }) },
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.address)} />
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={24}>
                    <Form.Item>
                      {getFieldDecorator(`address.city`, {
                        initialValue: address && address.city,
                        rules: [
                          { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                        ],
                      })(
                        <FloatingLabel placeholder={intl.formatMessage(messages.city)} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator(`address.postal_code`, {
                        initialValue: address && address.postal_code,
                        rules: [
                          { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                        ],
                      })(
                        <FloatingLabel placeholder={intl.formatMessage(messages.postalCode)} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator(`address.country`, {
                        initialValue: address && address.country,
                        rules: [
                          { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                        ],
                      })(
                        <FloatingLabel placeholder={intl.formatMessage(messages.country)} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </section>
              <ChangePasswordForm />
              {
                /*
                !handwrittenDisabled &&
                <section className={s.section}>
                  <h1 className={s.header}>{'Company  Logo'}</h1>
                  <Avatar isLogo = {true} intl={intl}/>
                </section>
                */
              }
            </Col>
          </Row>
        </div>
        <div className={s.actionsWrapper}>
          <div className={s.actions}>
            <Button type='primary' ghost onClick={this.handleSubmit}>
              <PlusIcon />
              {intl.formatMessage(messages.save)}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user.user,
  cards: state.user.cards,
  loading: state.user.loading,
  changedSetting: state.user.changedSetting,
  global: state.global
})

const mapDispatch = {
  updateUser,
  getAllCards,
  makeStripePayment,
  addCard,
  setChangingStatusSetting,
  setNextRouteName,
  navigateToNextRouteName
}

export default connect(mapState, mapDispatch)(Form.create({
  onValuesChange(props, fields, values) {
    props.setChangingStatusSetting(true);
  },
})(withStyles(s, creditCardStyles)(User)))
