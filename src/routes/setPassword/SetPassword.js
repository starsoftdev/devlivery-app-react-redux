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
        this.props.setPassword({...values, ...this.props.params})
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {loading, error} = this.props

    return (
      <main className={s.container}>
        <div className={s.formWrapper}>
          <h1 className={s.header}>{'Set Password'}</h1>
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
            <Form.Item className={s.btnWrapper}>
              <Button
                type='primary'
                htmlType='submit'
                className={s.btn}
                loading={loading}
              >
                {'Submit'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
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
