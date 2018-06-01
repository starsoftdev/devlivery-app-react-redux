import React from 'react'
import {connect} from 'react-redux'
import {Link} from '../../components'
import {clear, login} from '../../reducers/login'
import {Alert, Button, Col, Form, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Login.css'
import formMessages from '../../formMessages'
import {RESET_PASSWORD_ROUTE} from '../'
import {REGISTER1_ROUTE} from '../index'

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
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <h1 className={s.header}>Login In To Your Account</h1>
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
            {getFieldDecorator('email', {
              rules: [
                {required: true, message: formMessages.required},
                {type: 'email', message: formMessages.emailInvalid},
              ],
            })(
              <Input placeholder={'Email'}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                {required: true, message: formMessages.required},
              ],
            })(
              <Input type='password' placeholder={'Password'}/>
            )}
          </Form.Item>
          <Row gutter={16} type='flex' justify='space-between'>
            <Col>
              New here?
              <Link to={REGISTER1_ROUTE} className={s.registerBtn}>
                Create Account
              </Link>
            </Col>
            <Col>
              <Link to={RESET_PASSWORD_ROUTE} className={s.forgotPasswordBtn}>
                Forgot Password?
              </Link>
            </Col>
          </Row>
        </div>
        <div className={s.actions}>
          <Button type='primary' htmlType='submit' className={s.loginBtn} loading={loading}>
            Login
          </Button>
        </div>
      </Form>
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
