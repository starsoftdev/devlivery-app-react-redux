import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register4.css'
import ArrowIcon from '../../static/decor_arrow.svg'
import PlusIcon from '../../static/plus.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'
import {register} from '../../reducers/register'

let uuid = 1

class Register4 extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.register(values.people)
      }
    })
  }

  // TODO add remove button somewhere
  removeItem = (k) => {
    const keys = this.props.form.getFieldValue('keys')
    const newKeys = keys.filter(key => key !== k)
    this.props.form.setFieldsValue({keys: newKeys})
  }

  addItem = () => {
    const keys = this.props.form.getFieldValue('keys')
    const newKeys = keys.concat(uuid)
    uuid++
    this.props.form.setFieldsValue({keys: newKeys})
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form
    this.props.form.getFieldDecorator('keys', {initialValue: [0]})

    const keys = getFieldValue('keys')

    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <h1 className={s.header}>
            <span className={s.headerPrefix}>
              4
              <ArrowIcon className={s.arrowIcon}/>
            </span>
            Invite People
          </h1>
          {keys.map((k, i) =>
            <section key={k} className={s.person}>
              <Form.Item>
                {getFieldDecorator(`people[${k}].email`, {
                  rules: [
                    {required: true, message: formMessages.required},
                    {type: 'email', message: formMessages.emailInvalid},
                  ],
                })(
                  <Input placeholder={'Email'}/>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator(`people[${k}].role`, {
                  rules: [
                    {required: true, message: formMessages.required},
                  ],
                })(
                  <Input placeholder={'Role'}/>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator(`people[${k}].permissions`, {
                  rules: [
                    {required: true, message: formMessages.required},
                  ],
                })(
                  <Select placeholder={'Permissions Level'} notFoundContent='No Items'>
                    {['Permission 1', 'Permission 2'].map((permission, i) =>
                      <Select.Option key={permission} value={permission}>{permission}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </section>
          )}
          <div className={s.addPersonBtnWrapper}>
            <Button type='primary' ghost onClick={this.addItem} className={s.addPersonBtn}>
              <PlusIcon className={s.plusIcon}/>
              Invite one more
            </Button>
          </div>
        </div>
        <div className={s.actions}>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button htmlType='submit' type='primary' className={s.submitBtn}>
            Submit
          </Button>
        </div>
      </Form>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {
  register,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register4)))
