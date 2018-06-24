import React from 'react'
import {connect} from 'react-redux'
import {clear, resetPassword} from '../../reducers/resetPassword'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {Alert, Button, Form, Input} from 'antd'
import s from './ResetPassword.css'
import formMessages from '../../formMessages'
import messages from './messages'

class ResetPassword extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.resetPassword(values, this.props.form)
      }
    })
  }

  render() {
    const {loading, success, error, intl} = this.props
    const {getFieldDecorator} = this.props.form

    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
        <div className={s.content}>
          {success && (
            <Alert
              className={s.alert}
              message={success}
              type='success'
              closable
            />
          )}
          {error && (
            <Alert
              className={s.alert}
              message={error}
              type='error'
              closable
            />
          )}
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
  ...state.resetPassword,
})

const mapDispatch = {
  resetPassword,
  clear,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(ResetPassword)))
