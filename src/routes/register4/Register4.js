import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register4.css'
import PlusIcon from '../../static/plus.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'
import {register} from '../../reducers/register'
import messages from './messages'
import {Actions, Link, SectionHeader} from '../../components'
import {ORDERS_ROUTE} from '../index'

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
    const {intl} = this.props
    const {getFieldDecorator, getFieldValue} = this.props.form
    this.props.form.getFieldDecorator('keys', {initialValue: [0]})

    const keys = getFieldValue('keys')

    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={4}
            prefixClassName={s.headerPrefix}
          />
          {keys.map((k, i) =>
            <section key={k} className={s.person}>
              <Form.Item>
                {getFieldDecorator(`people[${k}].email`, {
                  rules: [
                    {required: true, message: intl.formatMessage(formMessages.required)},
                    {type: 'email', message: intl.formatMessage(formMessages.emailInvalid)},
                  ],
                })(
                  <Input placeholder={intl.formatMessage(messages.email)}/>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator(`people[${k}].permissions`, {
                })(
                  <Select placeholder={intl.formatMessage(messages.permissionsLevel)}>
                    {[].map((permission) =>
                      <Select.Option key={permission} value={permission}>{permission}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </section>
          )}
          <div className={s.addPersonBtnWrapper}>
            <Button type='primary' ghost onClick={this.addItem}>
              <PlusIcon/>
              {intl.formatMessage(messages.inviteMore)}
            </Button>
          </div>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Link to={ORDERS_ROUTE}>
            <Button
              type='primary'
              ghost
            >
              {intl.formatMessage(messages.skip)}
            </Button>
          </Link>
          <Button htmlType='submit' type='primary'>
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </Form>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {
  register,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register4)))
