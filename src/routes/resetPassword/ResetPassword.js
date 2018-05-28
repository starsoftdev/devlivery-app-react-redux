import React from 'react'
import {connect} from 'react-redux'
import {clear, resetPassword} from '../../reducers/resetPassword'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {Alert, Button, Form, Input} from 'antd'
import s from './ResetPassword.css'
import formMessages from '../../formMessages'

const FormItem = Form.Item

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
      <main className={s.container}>
        <div className={s.formWrapper}>
          <h1 className={s.header}>{'Reset Password'}</h1>
          {success && (
            <Alert
              className={s.alert}
              message={success}
              type='success'
              showIcon
              closable
            />
          )}
          {error && (
            <Alert
              className={s.alert}
              message={error}
              type='error'
              showIcon
              closable
            />
          )}
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  {required: true, message: formMessages.required},
                  {type: 'email', message: formMessages.emailInvalid},
                ],
              })(
                <Input placeholder={'Email'}/>
              )}
            </FormItem>
            <FormItem className={s.btnWrapper}>
              <Button
                type='primary'
                htmlType='submit'
                className={s.btn}
                loading={loading}
              >
                {'Submit'}
              </Button>
            </FormItem>
          </Form>
        </div>
      </main>
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
