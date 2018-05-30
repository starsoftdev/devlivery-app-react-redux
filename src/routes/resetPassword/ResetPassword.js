import React from 'react'
import {connect} from 'react-redux'
import {clear, resetPassword} from '../../reducers/resetPassword'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {Alert, Button, Form, Input} from 'antd'
import s from './ResetPassword.css'
import formMessages from '../../formMessages'

class ResetPassword extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.resetPassword(values)
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {loading, success, error} = this.props

    return (
      <React.Fragment>
        <h1 className={s.header}>Reset Password</h1>
        <Form onSubmit={this.handleSubmit} className={s.form}>
          <div className={s.formContent}>
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
                  {required: true, message: formMessages.required},
                  {type: 'email', message: formMessages.emailInvalid},
                ],
              })(
                <Input placeholder={'Email'}/>
              )}
            </Form.Item>
          </div>
          <div className={s.actions}>
            <Button type='primary' htmlType='submit' className={s.submitBtn} loading={loading}>
              Submit
            </Button>
          </div>
        </Form>
      </React.Fragment>
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
