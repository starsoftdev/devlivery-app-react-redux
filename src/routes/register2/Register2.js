import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, DatePicker, Form, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register2.css'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'
import {register} from '../../reducers/register'
import messages from './messages'
import {DATE_FORMAT, DISPLAYED_DATE_FORMAT} from '../../constants'
import {Actions, SectionHeader} from '../../components'
import {FloatingLabel} from '../../components';

class Register2 extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.register(values, this.props.form)
      }
    })
  }

  render() {
    const {individualDetails, intl} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <section>
            <SectionHeader
              header={intl.formatMessage(messages.header)}
              number={2}
              prefixClassName={s.headerPrefix}
            />
            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Form.Item>
                  {getFieldDecorator('first_name', {
                    initialValue: individualDetails && individualDetails.first_name,
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.firstName)}/>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item>
                  {getFieldDecorator('last_name', {
                    initialValue: individualDetails && individualDetails.last_name,
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.lastName)}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              {getFieldDecorator('email', {
                validateTrigger: 'onSubmit',//'onBlur'
                initialValue: individualDetails && individualDetails.email,
                rules: [
                  {required: false, message: intl.formatMessage(formMessages.required)},
                  {type: 'email', message: intl.formatMessage(formMessages.emailInvalid)},
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.email)}/>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('phone', {
                initialValue: individualDetails && individualDetails.phone,
                rules: [
                  {required: false, message: intl.formatMessage(formMessages.required)},
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.phone)}/>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {required: true, message: intl.formatMessage(formMessages.required)},
                ],
              })(
                <FloatingLabel type='password' placeholder={intl.formatMessage(messages.password)}/>
              )}
            </Form.Item>
          </section>
          <section>
            <h1 className={s.sectionHeader}>
              {intl.formatMessage(messages.birthday)}
            </h1>
            <Form.Item>
              {getFieldDecorator('birthday', {
                initialValue: individualDetails ? individualDetails.birthday : undefined,
              })(
                <DatePicker className={s.birthday} format={DISPLAYED_DATE_FORMAT}/>
              )}
            </Form.Item>
          </section>
         
          <section className={s.section}>
            <h1 className={s.sectionHeader}>{intl.formatMessage(messages.shipAddress)}</h1>
            <Form.Item>
              {getFieldDecorator(`company`, {
                initialValue: individualDetails && individualDetails.company,
                rules: [
                  {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.company)}/>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`address`, {
                initialValue: individualDetails && individualDetails.address,
                rules: [
                  {required: false, message: intl.formatMessage(formMessages.required), whitespace: true},
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.address)}/>
              )}
            </Form.Item>
            <Row gutter={20}>
              <Col xs={24} sm={24}>
                <Form.Item>
                  {getFieldDecorator(`city`, {
                    initialValue: individualDetails && individualDetails.city,
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.city)}/>
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
                      {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.postalCode)}/>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item>
                  {getFieldDecorator(`country`, {
                    initialValue: individualDetails && individualDetails.country,
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.country)}/>
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
})

const mapDispatch = {
  register,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register2)))
