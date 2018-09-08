import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Icon, Input, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register4.css'
import PlusIcon from '../../static/plus.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'
import {invitePeople} from '../../reducers/register'
import messages from './messages'
import {Actions, Link, SectionHeader} from '../../components'
import {ORDERS_ROUTE} from '../'

class Register4 extends React.Component {
  uuid = 1

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.invitePeople(values.people)
      }
    })
  }

  removeItem = (k) => {
    const keys = this.props.form.getFieldValue('keys')
    const newKeys = keys.filter(key => key !== k)
    this.props.form.setFieldsValue({keys: newKeys})
  }

  addItem = () => {
    const keys = this.props.form.getFieldValue('keys')
    const newKeys = keys.concat(this.uuid)
    this.uuid++
    this.props.form.setFieldsValue({keys: newKeys})
  }

  render() {
    const {intl, roles,fromdashboard} = this.props
    const {getFieldDecorator, getFieldValue} = this.props.form
    this.props.form.getFieldDecorator('keys', {initialValue: [0]})
    
    const keys = getFieldValue('keys')

    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={fromdashboard === "true" ? null : 4}
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
                {getFieldDecorator(`people[${k}].roles`, {
                  initialValue: roles.length > 0 ? roles[0].id+'' :undefined,
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required)},
                    ],
                  })(
                  <Select
                    allowClear
                    //mode='multiple'
                    placeholder={intl.formatMessage(messages.role)}
                  >
                    {roles.map(item =>
                      <Select.Option key={item.id} value={item.id+''}>{item.name}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
              {i > 0 && (
                <Icon type='close' onClick={() => this.removeItem(k)} className={s.removeIcon}/>
              )}
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
          {
            fromdashboard !== "true" &&
            <Link to={ORDERS_ROUTE}>
              <Button
                type='primary'
                ghost
              >
                {intl.formatMessage(messages.skip)}
              </Button>
            </Link>
          }
          <Button htmlType='submit' type='primary'>
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </Form>
    )
  }
}

const mapState = state => ({
  roles: state.register.roles,
})

const mapDispatch = {
  invitePeople,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register4)))
