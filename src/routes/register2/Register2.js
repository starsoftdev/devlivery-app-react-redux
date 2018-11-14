import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, DatePicker, Form, Input, Row } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register2.css'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import formMessages from '../../formMessages'
import { register, TEAM_ACCOUNT } from '../../reducers/register'
import messages from './messages'
import { Actions, SectionHeader } from '../../components'
import { FloatingLabel } from '../../components';
import moment from 'moment'
import Cleave from 'cleave.js/react';

class Register2 extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      var dobValidation = false;
      var birthday = moment(values.birthday,'DD/MM/YYYY');
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
      }
      else {
        if (values.birthday && values.birthday.length > 0)
          this.props.form.setFields({
            birthday: {
              value: values.birthday,
              errors: [new Error('Invalid Date Format.')],
            },
          });
      }
      if (!err && dobValidation) {
        this.props.register(values, this.props.form)
      }
    })
  }

  render() {
    const { individualDetails, intl, accountType } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <section>
            <SectionHeader
              header={intl.formatMessage(messages.header)}
              //number={2}
              prefixClassName={s.headerPrefix}
            />
            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Form.Item>
                  {getFieldDecorator('first_name', {
                    initialValue: individualDetails && individualDetails.first_name,
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
                    initialValue: individualDetails && individualDetails.last_name,
                    rules: [
                      { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.lastName)} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              {getFieldDecorator('email', {
                validateTrigger: 'onBlur',
                initialValue: individualDetails && individualDetails.email,
                rules: [
                  { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                  { type: 'email', message: intl.formatMessage(formMessages.emailInvalid) },
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.email)} />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('phone', {
                initialValue: individualDetails && individualDetails.phone,
                rules: [
                  { required: false, message: intl.formatMessage(formMessages.required) },
                ],
              })(
                <FloatingLabel type='phone' placeholder={intl.formatMessage(messages.phone)} />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: intl.formatMessage(formMessages.required) },
                ],
              })(
                <FloatingLabel type='password' placeholder={intl.formatMessage(messages.password)} />
              )}
            </Form.Item>
          </section>
          <section>
            <h1 className={s.sectionHeader}>
              {intl.formatMessage(messages.birthday)}
            </h1>
            <Form.Item>
              {getFieldDecorator('birthday', {
                //initialValue: individualDetails ? moment(individualDetails.birthday).format("DD/MM/YYYY") : undefined,
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
            <h1 className={s.sectionHeader}>{intl.formatMessage(messages.shipAddress)}</h1>
            <Form.Item>
              {getFieldDecorator(`company`, {
                initialValue: individualDetails && individualDetails.company,
                rules: [
                  { required: accountType === TEAM_ACCOUNT ? true : false, min: accountType === TEAM_ACCOUNT ? 5 : 0, message: intl.formatMessage(formMessages.minLength, { length: 5 }) },
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.company)} />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`address`, {
                initialValue: individualDetails && individualDetails.address,
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
                    initialValue: individualDetails && individualDetails.city,
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
                    initialValue: individualDetails && individualDetails.postal_code,
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
                    initialValue: individualDetails && individualDetails.country,
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
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button htmlType='submit' type='primary'>
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </Form>
    )
  }
}

const mapState = state => ({
  individualDetails: state.register.individualDetails,
  accountType: state.register.accountType
})

const mapDispatch = {
  register,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register2)))
