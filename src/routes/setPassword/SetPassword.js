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
  componentWillUnmount() {
    this.props.clear()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.setPassword({...values, token: this.props.query.token})
      }
    })
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
                {required: true, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <FloatingLabel
                type='password'
                placeholder={intl.formatMessage(messages.password)}
              />
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
