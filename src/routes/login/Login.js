import React from 'react'
import {connect} from 'react-redux'
import {Link} from '../../components'
import {clear, login} from '../../reducers/login'
import {Alert, Button, Form, Icon, Input} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Login.css'
import formMessages from '../../formMessages'
import {FORGOT_PASSWORD_ROUTE} from '../'

class Login extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values, this.props.redirectUrl)
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {loading, error} = this.props
    return (
      <main className={s.container}>
        <div className={s.formWrapper}>
          <h1 className={s.header}>Login In To Your Account</h1>
          {error && (
            <Alert
              className={s.alert}
              message={error}
              type='error'
              showIcon
              closable
            />
          )}
          <Form onSubmit={this.handleSubmit} className={s.form}>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [
                  {required: true, message: formMessages.required},
                  {type: 'email', message: formMessages.emailInvalid},
                ],
              })(
                <Input
                  placeholder={'Email'}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {required: true, message: formMessages.required},
                ],
              })(
                <Input
                  type='password'
                  placeholder={'Password'}
                />
              )}
            </Form.Item>
            <Form.Item className={s.forgotPassword}>
              {/*<Link to={FORGOT_PASSWORD_ROUTE}>*/}
              Forgot Password?
              {/*</Link>*/}
            </Form.Item>
            <Form.Item className={s.actions}>
              <Button type='primary' htmlType='submit' className={s.loginBtn} loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    )
  }
}

const mapState = state => ({
  ...state.login,
})

const mapDispatch = {
  login,
  clear,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Login)))
