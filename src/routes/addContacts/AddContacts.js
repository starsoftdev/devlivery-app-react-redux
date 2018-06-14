import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Input, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddContacts.css'
import formMessages from '../../formMessages'
import moment from 'moment'
import PlusIcon from '../../static/plus.svg'

class AddContacts extends React.Component {
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
          <Row type='flex' gutter={20}>
            <Col xs={24} md={12}>
              <section className={s.section}>
                <h1 className={s.header}>Add Contact</h1>
                <Form.Item>
                  {getFieldDecorator('role', {
                    initialValue: account ? account.role : undefined,
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Select placeholder={'Role'}>
                      {[].map((item) =>
                        <Select.Option key={item} value={item}>{item}</Select.Option>
                      )}
                    </Select>
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
                  {getFieldDecorator('nickname', {
                    initialValue: account && account.nickname,
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'Nickname'}/>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('relationship', {
                    initialValue: account && account.relationship,
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'Relationship'}/>
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
                <h1 className={s.header}>Home Address</h1>
                <Form.Item>
                  {getFieldDecorator('home_address', {
                    initialValue: account && account.home_address,
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
                      {getFieldDecorator('home_city', {
                        initialValue: account && account.home_city,
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
                      {getFieldDecorator('home_state', {
                        initialValue: account && account.home_state,
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
                      {getFieldDecorator('home_postal_code', {
                        initialValue: account && account.home_postal_code,
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
                      {getFieldDecorator('home_country', {
                        initialValue: account && account.home_country,
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
            </Col>
            <Col xs={24} md={12} className={s.rightColumn}>
              <section className={s.section}>
                <h1 className={s.header}>Reminders</h1>
                <Form.Item>
                  {getFieldDecorator('reminder_name', {
                    initialValue: account && account.reminder_name,
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'Name'}/>
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    {/* TODO add birthday fields as on Register 2 */}
                    <Form.Item>
                      {getFieldDecorator('reminder_month', {
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
                      {getFieldDecorator('reminder_date', {
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
                      {getFieldDecorator('reminder_year', {
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
                <Button type='primary' ghost>
                  <PlusIcon/>
                  Add new reminder
                </Button>
              </section>
            </Col>
          </Row>
        </Form>
        <div className={s.actionsWrapper}>
          <div className={s.actions}>
            <Button type='primary' ghost>
              <PlusIcon/>
              Save Contact
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

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(AddContacts)))
