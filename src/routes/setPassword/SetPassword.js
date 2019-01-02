import React from 'react'
import {connect} from 'react-redux'
import {clear, setPassword} from '../../reducers/setPassword'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {Alert, Button, Form, Input} from 'antd'
import s from './SetPassword.css'
import formMessages from '../../formMessages'
import messages from './messages'
import {FloatingLabel} from '../../components';

class SetPassword extends React.Component {
  state = {
    confirmDirty: false,
  }
  componentWillUnmount() {
    this.props.clear()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(values['password'] !== values['password_confirmation'])
        {
          this.props.form.setFields({
            password_confirmation: {
              value: values['password_confirmation'],
              errors: [new Error(this.props.intl.formatMessage(formMessages.passwordNotMatch))],
            },
          });
          return;
        }
        this.props.setPassword({...values, token: this.props.query.token, email: this.props.query.email})
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
    const { intl } = this.props
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['password_confirmation'], { force: true })
    }
    callback()
  }
  render() {
    const {loading, error, intl} = this.props
    const {getFieldDecorator} = this.props.form

    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
        <div className={s.content}>
          {error && (
            <Alert
              className={s.alert}
              message={error}
              type='error'
              closable
            />
          )}
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: intl.formatMessage(formMessages.required) },
                { validator: this.validateToNextPassword },
              ],
            })(
              <FloatingLabel
                type='password'
                placeholder={intl.formatMessage(messages.password)}
              />
            )}
          </Form.Item>
          <Form.Item>
              {getFieldDecorator('password_confirmation', {
                rules: [
                  { required: true, message: intl.formatMessage(formMessages.required) },
                  { validator: this.compareToFirstPassword },
                ],
              })(
                <FloatingLabel type='password' placeholder={intl.formatMessage(messages.confirmpswd)} onBlur={this.handleConfirmBlur} />
              )}
            </Form.Item>
        </div>
        <div className={s.actions}>
          <Button type='primary' htmlType='submit' className={s.submitBtn} loading={loading}>
            {intl.formatMessage(messages.submit)}
          </Button>
        </div>
      </Form>
    )
  }
}

const mapState = state => ({
  ...state.setPassword,
})

const mapDispatch = {
  setPassword,
  clear,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(SetPassword)))
