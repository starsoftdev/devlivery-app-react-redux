import React from 'react'
import {connect} from 'react-redux'
import {clear, setPassword} from '../../reducers/setPassword'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {Alert, Button, Form, Input} from 'antd'
import s from './SetPassword.css'
import formMessages from '../../formMessages'

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
    const {getFieldDecorator} = this.props.form
    const {loading, error} = this.props

    return (
      <React.Fragment>
        <h1 className={s.header}>Set Password</h1>
        <Form onSubmit={this.handleSubmit} className={s.form}>
          <div className={s.formContent}>
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
                  {required: true, message: formMessages.required},
                ],
              })(
                <Input
                  type='password'
                  placeholder={'Password'}
                />
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
  ...state.setPassword,
})

const mapDispatch = {
  setPassword,
  clear,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(SetPassword)))
