import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ChangePasswordForm.css'
import {Button, Col, Form, Input, Row} from 'antd'
import formMessages from '../../formMessages'
import {injectIntl} from 'react-intl'
import {connect} from 'react-redux'
import {updatePassword} from '../../reducers/user'
import {FloatingLabel} from '../../components';

class ChangePasswordForm extends React.Component {
  state = {
    confirmDirty: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updatePassword(values, this.props.form)
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
    if (value && value !== form.getFieldValue('new_password')) {
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
    const {intl} = this.props
    const {getFieldDecorator} = this.props.form

    return (
      <Form className={s.section} onSubmit={this.handleSubmit}>
        <h1 className={s.header}>{'Change Password'}</h1>
        <Row gutter={20}>
          <Col xs={24} sm={12}>
            <Form.Item>
              {getFieldDecorator('old_password', {
                rules: [
                  {required: true, message: intl.formatMessage(formMessages.required)},
                ],
              })(
                <FloatingLabel placeholder={'Old Password'} type='password'/>
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item>
              {getFieldDecorator('new_password', {
                rules: [
                  {required: true, message: intl.formatMessage(formMessages.required)},
                  {validator: this.validateToNextPassword},
                ],
              })(
                <FloatingLabel placeholder={'New Password'} type='password'/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          {getFieldDecorator('confirmation_password', {
            rules: [
              {required: true, message: intl.formatMessage(formMessages.required)},
              {validator: this.compareToFirstPassword},
            ],
          })(
            <FloatingLabel type='password' placeholder={'Password Confirmation'} onBlur={this.handleConfirmBlur}/>
          )}
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit' type='primary' ghost>{'Change'}</Button>
        </Form.Item>
      </Form>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {
  updatePassword,
}

export default injectIntl(connect(mapState, mapDispatch)(Form.create()(withStyles(s)(ChangePasswordForm))))
