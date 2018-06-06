import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Input, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase9.css'
import {Actions, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'

class Purchase9 extends React.Component {
  state = {
    confirmDirty: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.register(values)
      }
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({confirmDirty: this.state.confirmDirty || !!value})
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Password does not match the confirm password.')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true})
    }
    callback()
  }

  render() {
    const {account} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={'Create Account'}
            number={9}
            prefixClassName={s.headerPrefix}
          />
          <Form.Item>
            {getFieldDecorator('type', {
              initialValue: account ? account.type : undefined,
              rules: [
                {required: true, message: formMessages.required},
              ],
            })(
              <Select placeholder={'Type'}>
                {[].map((item) =>
                  <Select.Option key={item} value={item}>{item}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              initialValue: account && account.email,
              rules: [
                {required: true, message: formMessages.required},
                {type: 'email', message: formMessages.emailInvalid},
              ],
            })(
              <Input placeholder={'Email'}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('phone', {
              initialValue: account && account.phone,
              rules: [
                {required: true, message: formMessages.required},
              ],
            })(
              <Input placeholder={'Phone'}/>
            )}
          </Form.Item>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [
                    {required: true, message: formMessages.required},
                    {validator: this.validateToNextPassword},
                  ],
                })(
                  <Input type='password' placeholder={'Password'}/>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('password_confirmation', {
                  rules: [
                    {required: true, message: formMessages.required},
                    {validator: this.compareToFirstPassword},
                  ],
                })(
                  <Input type='password' placeholder={'Password Again'} onBlur={this.handleConfirmBlur}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('first_name', {
                  initialValue: account && account.first_name,
                  rules: [
                    {required: true, message: formMessages.required, whitespace: true},
                  ],
                })(
                  <Input placeholder={'First Name'}/>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('last_name', {
                  initialValue: account && account.last_name,
                  rules: [
                    {required: true, message: formMessages.required, whitespace: true},
                  ],
                })(
                  <Input placeholder={'Last Name'}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            {getFieldDecorator('role', {
              initialValue: account && account.role,
              rules: [
                {required: true, message: formMessages.required},
              ],
            })(
              <Input placeholder={'Role'}/>
            )}
          </Form.Item>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button
            type='primary'
            htmlType='submit'
          >
            Submit
          </Button>
        </Actions>
      </Form>
    )
  }
}

const mapState = state => ({
  loading: state.purchase.loading,
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Purchase9)))
