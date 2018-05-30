import React from 'react'
import {connect} from 'react-redux'
import {clear, register} from '../../reducers/register'
import {Button, Form, Input} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register4.css'
import formMessages from '../../formMessages'

class Register4 extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.register(values)
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <main className={s.container}>
        <div className={s.formWrapper}>
          <h1 className={s.header}>{'Invite People '}</h1>
          <Form onSubmit={this.handleSubmit} className={s.form}>
            <Form.Item>
              {getFieldDecorator('first_name', {
                rules: [
                  {required: true, message: formMessages.required, whitespace: true},
                ],
              })(
                <Input
                  placeholder={'First Name'}
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
            <Form.Item className={s.actions}>
              <Button type='primary' htmlType='submit' className={s.submitBtn}>
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
  ...state.register,
})

const mapDispatch = {
  register,
  clear,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register4)))
