import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Input, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase9.css'
import {PurchaseActions, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'
import {INDIVIDUAL_ACCOUNT, TEAM_ACCOUNT} from '../../reducers/register'
import {register} from '../../reducers/purchase'
import messages from './messages'

class Purchase9 extends React.Component {
  state = {
    confirmDirty: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.register(values, this.props.form)
      }
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({confirmDirty: this.state.confirmDirty || !!value})
  }

  compareToFirstPassword = (rule, value, callback) => {
    const {intl} = this.props
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
      form.validateFields(['password_confirmation'], {force: true})
    }
    callback()
  }

  render() {
    const {intl, flowIndex} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <Form.Item>
            {getFieldDecorator('account_type', {
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Select placeholder={intl.formatMessage(messages.type)}>
                {[
                  {label: intl.formatMessage(messages.individual), value: INDIVIDUAL_ACCOUNT},
                  {label: intl.formatMessage(messages.team), value: TEAM_ACCOUNT},
                ].map((item) =>
                  <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
                {type: 'email', message: intl.formatMessage(formMessages.emailInvalid)},
              ],
            })(
              <Input placeholder={intl.formatMessage(messages.email)}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('phone', {
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Input placeholder={intl.formatMessage(messages.phone)}/>
            )}
          </Form.Item>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [
                    {required: true, message: intl.formatMessage(formMessages.required)},
                    {validator: this.validateToNextPassword},
                  ],
                })(
                  <Input type='password' placeholder={intl.formatMessage(messages.password)}/>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('password_confirmation', {
                  rules: [
                    {required: true, message: intl.formatMessage(formMessages.required)},
                    {validator: this.compareToFirstPassword},
                  ],
                })(
                  <Input type='password' placeholder={intl.formatMessage(messages.passwordAgain)} onBlur={this.handleConfirmBlur}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('first_name', {
                  rules: [
                    {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                  ],
                })(
                  <Input placeholder={intl.formatMessage(messages.firstName)}/>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('last_name', {
                  rules: [
                    {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                  ],
                })(
                  <Input placeholder={intl.formatMessage(messages.lastName)}/>
                )}
              </Form.Item>
            </Col>
          </Row>
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
            {intl.formatMessage(messages.submit)}
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
