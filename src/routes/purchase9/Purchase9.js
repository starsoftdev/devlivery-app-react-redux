import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, Input, Row, Select } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase9.css'
import { PurchaseActions, SectionHeader, Link } from '../../components'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import formMessages from '../../formMessages'
import { INDIVIDUAL_ACCOUNT, TEAM_ACCOUNT } from '../../reducers/register'
import { register } from '../../reducers/purchase'
import messages from './messages'
import { FloatingLabel } from '../../components';
import moment from 'moment'
import {DATE_FORMAT, DISPLAYED_DATE_FORMAT} from '../../constants'
import Cleave from 'cleave.js/react';

class Purchase9 extends React.Component {
  state = {
    confirmDirty: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      var dobValidation = false;
      var birthday = moment(values.birthday,'DD/MM/YYYY');
      var expected = moment().subtract(18, 'years');
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
      if (!err && dobValidation) {
        this.props.register(values, this.props.form)
      }
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { intl } = this.props
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.formatMessage(formMessages.passwordNotMatch))
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['password_confirmation'], { force: true })
    }
    callback()
  }

  render() {
    const { intl, flowIndex } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <div>
            <Link to={{ name: "login", params: { inpurchase: true } }}>
              <h4 className={s.loginbutton}>{intl.formatMessage(messages.haveaccount)}</h4>
            </Link>
          </div>
          <Form.Item>
            {getFieldDecorator('account_type', {
              rules: [
                { required: true, message: intl.formatMessage(formMessages.required) },
              ],
            })(
              <Select placeholder={intl.formatMessage(messages.type)} onChange={()=>this.setState({...this.state})}>
                {[
                  { label: intl.formatMessage(messages.individual), value: INDIVIDUAL_ACCOUNT },
                  { label: intl.formatMessage(messages.team), value: TEAM_ACCOUNT },
                ].map((item) =>
                  <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: intl.formatMessage(formMessages.required) },
                { type: 'email', message: intl.formatMessage(formMessages.emailInvalid) },
              ],
            })(
              <FloatingLabel placeholder={intl.formatMessage(messages.email)} />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('phone', {
              rules: [
                { required: false, message: intl.formatMessage(formMessages.required) },
              ],
            })(
              <FloatingLabel placeholder={intl.formatMessage(messages.phone)} />
            )}
          </Form.Item>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: intl.formatMessage(formMessages.required) },
                    { validator: this.validateToNextPassword },
                  ],
                })(
                  <FloatingLabel type='password' placeholder={intl.formatMessage(messages.password)} />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('password_confirmation', {
                  rules: [
                    { required: true, message: intl.formatMessage(formMessages.required) },
                    { validator: this.compareToFirstPassword },
                  ],
                })(
                  <FloatingLabel type='password' placeholder={intl.formatMessage(messages.passwordAgain)} onBlur={this.handleConfirmBlur} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('first_name', {
                  rules: [
                    { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                  ],
                })(
                  <FloatingLabel placeholder={intl.formatMessage(messages.firstName)} />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('last_name', {
                  rules: [
                    { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                  ],
                })(
                  <FloatingLabel placeholder={intl.formatMessage(messages.lastName)} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <section>
            <h1 className={s.sectionHeader}>
              {intl.formatMessage(messages.birthday)}
            </h1>
            <Form.Item>
              {getFieldDecorator('birthday', {
                rules: [
                  {required: true, message: intl.formatMessage(formMessages.required)},
                ],
              })(
                <Cleave
                  placeholder="DD/MM/YYYY"
                  options={{
                    date: true,
                    datePattern: ['d', 'm', 'Y']
                  }}
                />
              )}
            </Form.Item>
          </section>
          <section className={s.section}>
            <h1 className={s.sectionHeader}>{intl.formatMessage(messages.shipAddress)}</h1>
            <Form.Item>
              {getFieldDecorator(`company`, {
                rules: [
                  {required: this.props.form.getFieldValue('account_type') === TEAM_ACCOUNT ? true:false , min: 5, message: intl.formatMessage(formMessages.minLength, {length: 5})},
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.company)} />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`address`, {
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
                  {getFieldDecorator(`city`, {
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
                  {getFieldDecorator(`postal_code`, {
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
                  {getFieldDecorator(`country`, {
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

        </div>
        <PurchaseActions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button
            type='primary'
            htmlType='submit'
          >
            {intl.formatMessage(messages.header)}
          </Button>
        </PurchaseActions>
      </Form>
    )
  }
}

const mapState = state => ({
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  register,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Purchase9)))
