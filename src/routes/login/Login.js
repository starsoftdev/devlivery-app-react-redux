import React from 'react'
import {connect} from 'react-redux'
import {Link} from '../../components'
import {clear, login} from '../../reducers/login'
import {Alert, Button, Col, Form, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Login.css'
import {RESET_PASSWORD_ROUTE, REGISTER1_ROUTE} from '../'
import messages from './messages'
import formMessages from '../../formMessages'
import {nextFlowStep} from '../../reducers/purchase';
import {FloatingLabel} from '../../components';

class Login extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values, this.props.redirectUrl, ()=>{
          if(this.props.inpurchase)
          {
            this.props.nextFlowStep();
          }
        })
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {loading, error, intl} = this.props
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
            {getFieldDecorator('email', {
              validateTrigger: 'onSubmit',//'onBlur'
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
                {type: 'email', message: intl.formatMessage(formMessages.emailInvalid)},
              ],
            })(
              <FloatingLabel placeholder={intl.formatMessage(messages.email)}/>
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
          <Row gutter={16} type='flex' justify='space-between'>
            <Col>
              {intl.formatMessage(messages.newHere)}
              <Link to={REGISTER1_ROUTE} className={s.registerBtn}>
                {intl.formatMessage(messages.createAccount)}
              </Link>
            </Col>
            <Col>
              <Link to={RESET_PASSWORD_ROUTE} className={s.forgotPasswordBtn}>
                {intl.formatMessage(messages.forgotPassword)}
              </Link>
            </Col>
          </Row>
        </div>
        <div className={s.actions}>
          <Button type='primary' htmlType='submit' className={s.loginBtn} loading={loading}>
            {intl.formatMessage(messages.submit)}
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
  nextFlowStep
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Login)))
