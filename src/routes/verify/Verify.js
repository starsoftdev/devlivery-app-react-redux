import React from 'react'
import {connect} from 'react-redux'
import {Link} from '../../components'
import {clear, verify, navigateToLogin} from '../../reducers/login'
import {Alert, Button, Col, Form, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Verify.css'
import {RESET_PASSWORD_ROUTE, REGISTER1_ROUTE} from '../'
import messages from './messages'
import formMessages from '../../formMessages'

class Verify extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }
  componentWillMount(){
    this.props.verify(this.props.token);
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.navigateToLogin();
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {loading, error, intl} = this.props
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <h1 className={s.header}>{intl.formatMessage(messages.verify)}</h1>
        <div className={s.content}>
          
        </div>
        <div className={s.actions}>
          <Button type='primary' htmlType='submit' className={s.loginBtn} loading={loading}>
            {intl.formatMessage(messages.verifysubmit)}
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
  verify,
  clear,
  navigateToLogin
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Verify)))
