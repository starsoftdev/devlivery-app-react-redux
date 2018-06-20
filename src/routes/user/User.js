import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Input, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './User.css'
import formMessages from '../../formMessages'
import moment from 'moment'
import PlusIcon from '../../static/plus.svg'

class User extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.addContacts(values)
      }
    })
  }

  render() {
    const {account} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <div className={s.container}>
        <Form onSubmit={this.handleSubmit} className={s.form}>
          <Row type='flex' gutter={20} className={s.leftColumn}>
            <Col xs={24} md={12}>
              <section className={s.section}>
                <h1 className={s.header}>Personal Information</h1>
                <Form.Item>
                  {getFieldDecorator('nickname', {
                    initialValue: account && account.nickname,
                    rules: [
                      {required: true, message: formMessages.required, whitespace: true},
                    ],
                  })(
                    <Input placeholder={'Nickname'}/>
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('first_name', {
                        initialValue: account && account.first_name,
                        rules: [
                          {required: true, message: formMessages.required, whitespace: true},
                        ],
                      })(
                        <Input placeholder={'First Name'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('last_name', {
                        initialValue: account && account.last_name,
                        rules: [
                          {required: true, message: formMessages.required, whitespace: true},
                        ],
                      })(
                        <Input placeholder={'Last Name'}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  {getFieldDecorator('email', {
                    rules: [
                      {required: true, message: formMessages.required},
                      {type: 'email', message: formMessages.emailInvalid},
                    ],
                  })(
                    <Input placeholder={'Email'}/>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('phone', {
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'Phone'}/>
                  )}
                </Form.Item>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>Birthday</h1>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    {/* TODO add birthday fields as on Register 2 */}
                    <Form.Item>
                      {getFieldDecorator('month', {
                        initialValue: account ? account.month : undefined,
                        rules: [
                          {required: true, message: formMessages.required},
                        ],
                      })(
                        <Select placeholder={'Month'}>
                          {moment.months().map((month, i) =>
                            <Select.Option key={month} value={i + 1}>{month}</Select.Option>
                          )}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item>
                      {getFieldDecorator('date', {
                        initialValue: account && account.date,
                        rules: [
                          {required: true, message: formMessages.required},
                        ],
                      })(
                        <Input placeholder={'Date'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item>
                      {getFieldDecorator('year', {
                        initialValue: account && account.year,
                        rules: [
                          {required: true, message: formMessages.required},
                        ],
                      })(
                        <Input placeholder={'Year'}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>Billing Details</h1>
                <Form.Item>
                  {getFieldDecorator('card_number', {
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'Card Number'}/>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('card_name', {
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'Card Name'}/>
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={6}>
                    {/* TODO add birthday fields as on Register 2 */}
                    <Form.Item>
                      {getFieldDecorator('card_month', {
                        initialValue: account ? account.month : undefined,
                        rules: [
                          {required: true, message: formMessages.required},
                        ],
                      })(
                        <Input placeholder={'MM'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item>
                      {getFieldDecorator('card_year', {
                        initialValue: account && account.date,
                        rules: [
                          {required: true, message: formMessages.required},
                        ],
                      })(
                        <Input placeholder={'YY'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('cvv', {
                        initialValue: account && account.year,
                        rules: [
                          {required: true, message: formMessages.required},
                        ],
                      })(
                        <Input placeholder={'CVV'}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </section>
            </Col>
            <Col xs={24} md={12} className={s.rightColumn}>
              <section className={s.section}>
                <h1 className={s.header}>Shipping Address</h1>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('shipping_first_name', {
                        initialValue: account && account.first_name,
                        rules: [
                          {required: true, message: formMessages.required, whitespace: true},
                        ],
                      })(
                        <Input placeholder={'First Name'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('shipping_last_name', {
                        initialValue: account && account.last_name,
                        rules: [
                          {required: true, message: formMessages.required, whitespace: true},
                        ],
                      })(
                        <Input placeholder={'Last Name'}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  {getFieldDecorator('shipping_company', {
                    initialValue: account && account.shipping_company,
                    rules: [
                      {required: true, message: formMessages.required, whitespace: true},
                    ],
                  })(
                    <Input placeholder={'Company'}/>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('shipping_address', {
                    initialValue: account && account.shipping_address,
                    rules: [
                      {required: true, message: formMessages.required, whitespace: true},
                    ],
                  })(
                    <Input placeholder={'Address'}/>
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('shipping_city', {
                        initialValue: account && account.shipping_city,
                        rules: [
                          {required: true, message: formMessages.required, whitespace: true},
                        ],
                      })(
                        <Input placeholder={'City'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('shipping_state', {
                        initialValue: account && account.shipping_state,
                        rules: [
                          {required: true, message: formMessages.required, whitespace: true},
                        ],
                      })(
                        <Input placeholder={'State'}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('shipping_postal_code', {
                        initialValue: account && account.shipping_postal_code,
                        rules: [
                          {required: true, message: formMessages.required},
                        ],
                      })(
                        <Input placeholder={'Postal Code'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('shipping_country', {
                        initialValue: account && account.shipping_country,
                        rules: [
                          {required: true, message: formMessages.required, whitespace: true},
                        ],
                      })(
                        <Input placeholder={'Country'}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>Change Password</h1>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('old_password', {
                        rules: [
                          {required: true, message: formMessages.required},
                        ],
                      })(
                        <Input placeholder={'Old Password'} type='password'/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('password', {
                        rules: [
                          {required: true, message: formMessages.required},
                        ],
                      })(
                        <Input placeholder={'New Password'} type='password'/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  {getFieldDecorator('confirmation_password', {
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'New Password'} type='password'/>
                  )}
                </Form.Item>
              </section>
            </Col>
          </Row>
        </Form>
        <div className={s.actionsWrapper}>
          <div className={s.actions}>
            <Button type='primary' ghost>
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
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(User)))
