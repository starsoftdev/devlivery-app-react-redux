import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register3.css'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'
import {addTeam} from '../../reducers/register'
import messages from './messages'
import {Actions, SectionHeader} from '../../components'

class Register3 extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addTeam(values)
      }
    })
  }

  render() {
    const {teamDetails, intl, roles} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={3}
            prefixClassName={s.headerPrefix}
          />
          <Form.Item>
            {getFieldDecorator('name', {
              initialValue: teamDetails && teamDetails.name,
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
              ],
            })(
              <Input placeholder={intl.formatMessage(messages.name)}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('role_id', {
              initialValue: teamDetails ? teamDetails.role_id : roles.length > 0 ? roles[0].id :undefined,
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Select
                allowClear
                placeholder={intl.formatMessage(messages.role)}
              >
                {roles.map(item =>
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button htmlType='submit' type='primary'>
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </Form>
    )
  }
}

const mapState = state => ({
  teamDetails: state.register.teamDetails,
  roles: state.register.roles,
})

const mapDispatch = {
  addTeam,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register3)))
