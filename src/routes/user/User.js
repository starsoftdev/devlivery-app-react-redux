import React from 'react'
import {connect} from 'react-redux'
import {Button, Checkbox, Col, DatePicker, Form, Input, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './User.css'
import formMessages from '../../formMessages'
import moment from 'moment'
import PlusIcon from '../../static/plus.svg'
import {DATE_FORMAT, DISPLAYED_DATE_FORMAT} from '../../constants'
import {ChangePasswordForm} from '../../components'
import {updateUser} from '../../reducers/user'
import messages from './messages'
import {FloatingLabel} from '../../components';

class User extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updateUser(values)
      }
    })
  }

  render() {
    const {user, intl} = this.props
    const {getFieldDecorator} = this.props.form
    
    const address = user && user.addresses && user.addresses.find(item => item.default !== null)

    const reminderTimes = [
      {value: 0, label: 'Same Day'},
      {value: 1, label: 'Day Before'},
      {value: 3, label: '3 Days Before'},
      {value: 7, label: '1 week before'},
    ]

    return (
      <div className={s.container}>
        <div className={s.form}>
          <Row type='flex' gutter={20} className={s.leftColumn}>
            <Col xs={24} md={12}>
              <section className={s.section}>
                <h1 className={s.header}>Personal Information</h1>
                <Form.Item>
                  {getFieldDecorator('user.nickname', {
                    initialValue: user && user.nickname ?user.nickname:'',
                  })(
                    <FloatingLabel placeholder={'Nickname'}/>
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('user.first_name', {
                        initialValue: user && user.first_name,
                        rules: [
                          {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                        ],
                      })(
                        <FloatingLabel placeholder={'First Name'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('user.last_name', {
                        initialValue: user && user.last_name,
                        rules: [
                          {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                        ],
                      })(
                        <FloatingLabel placeholder={'Last Name'}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  {getFieldDecorator('user.email', {
                    initialValue: user && user.email,
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required)},
                      {type: 'email', message: intl.formatMessage(formMessages.emailInvalid)},
                    ],
                  })(
                    <FloatingLabel placeholder={'Email'}/>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('user.phone', {
                    initialValue: user && user.phone,
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <FloatingLabel placeholder={'Phone'}/>
                  )}
                </Form.Item>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>Birthday</h1>
                <Form.Item>
                  {getFieldDecorator('birthday', {
                    initialValue: user && user.dob ? moment(user.dob, DATE_FORMAT) : undefined,
                  })(
                    <DatePicker className={s.birthday} format={DISPLAYED_DATE_FORMAT}/>
                  )}
                </Form.Item>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>Billing Details</h1>
                <Form.Item>
                  {getFieldDecorator('billing.card_number', {
                    initialValue: user && user.billing && user.billing.card_number,
                  })(
                    <FloatingLabel placeholder={'Card Number'}/>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('billing.name_on_card', {
                    initialValue: user && user.billing && user.billing.name_on_card,
                  })(
                    <FloatingLabel placeholder={'Card Name'}/>
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={6}>
                    <Form.Item>
                      {getFieldDecorator('billing.expiry_month', {
                        initialValue: user && user.billing && user.billing.expiry_month,
                      })(
                        <FloatingLabel placeholder={'MM'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item>
                      {getFieldDecorator('billing.expiry_year', {
                        initialValue: user && user.billing && user.billing.expiry_year,
                      })(
                        <FloatingLabel placeholder={'YYYY'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('billing.cvv', {
                        initialValue: user && user.billing && user.billing.cvv,
                      })(
                        <FloatingLabel placeholder={'CVV'}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>{'Contact Preferences'}</h1>
                <Form.Item className={s.checkboxWrapper}>
                  {getFieldDecorator('preference.notify_on_reminders', {
                    valuePropName: 'checked',
                    initialValue: user && user.preference &&  user.preference.notify_on_reminders,

                  })(
                    <Checkbox>Notify me of new reminders via email</Checkbox>
                  )}
                </Form.Item>
                <Form.Item className={s.checkboxWrapper}>
                  {getFieldDecorator('preference.receive_promotional_emails', {
                    valuePropName: 'checked',
                    initialValue: user && user.preference && user.preference.receive_promotional_emails,
                  })(
                    <Checkbox>I would like to receive promotional email</Checkbox>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('preference.remind', {
                    initialValue: user && user.preference ? user.preference.remind : undefined,
                  })(
                    <Select
                      allowClear
                      placeholder={'Notification Time for Upcoming Reminders'}
                      className={s.select}
                    >
                      {reminderTimes.map((item) =>
                        <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </section>
            </Col>
            <Col xs={24} md={12} className={s.rightColumn}>
              <section className={s.section}>
                <h1 className={s.header}>{'Shipping Address'}</h1>
                {address && address.id && getFieldDecorator(`address.id`, {
                  initialValue: address.id,
                })(
                  <Input type='hidden'/>
                )}
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('address.first_name', {
                        initialValue: address && address.first_name,
                      })(
                        <FloatingLabel placeholder={'First Name'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('address.last_name', {
                        initialValue: address && address.last_name,
                      })(
                        <FloatingLabel placeholder={'Last Name'}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  {getFieldDecorator(`address.company`, {
                    initialValue: address && address.company,
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.company)}/>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`address.address`, {
                    initialValue: address && address.address,
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                    ],
                  })(
                    <FloatingLabel placeholder={intl.formatMessage(messages.address)}/>
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={24}>
                    <Form.Item>
                      {getFieldDecorator(`address.city`, {
                        initialValue: address && address.city,
                        rules: [
                          {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                        ],
                      })(
                        <FloatingLabel placeholder={intl.formatMessage(messages.city)}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator(`address.postal_code`, {
                        initialValue: address && address.postal_code,
                        rules: [
                          {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                        ],
                      })(
                        <FloatingLabel placeholder={intl.formatMessage(messages.postalCode)}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator(`address.country`, {
                        initialValue: address && address.country,
                        rules: [
                          {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                        ],
                      })(
                        <FloatingLabel placeholder={intl.formatMessage(messages.country)}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </section>
              <ChangePasswordForm/>
            </Col>
          </Row>
        </div>
        <div className={s.actionsWrapper}>
          <div className={s.actions}>
            <Button type='primary' ghost onClick={this.handleSubmit}>
              <PlusIcon/>
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user.user,
})

const mapDispatch = {
  updateUser,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(User)))
