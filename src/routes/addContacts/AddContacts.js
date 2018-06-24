import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Input, Row, Select, DatePicker} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddContacts.css'
import formMessages from '../../formMessages'
import PlusIcon from '../../static/plus.svg'
import {addContact} from '../../reducers/contacts'
import {DATE_FORMAT} from '../../constants'
import Reminders from './Reminders'
import Groups from './Groups'
import messages from './messages'

const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.']

// TODO add accordion for sections
const AddressSection = ({getFieldDecorator, index, header, intl}) =>
  <section className={s.section}>
    <h1 className={s.header}>{header}</h1>
    <Form.Item>
      {getFieldDecorator(`addresses[${index}].address`, {
      })(
        <Input placeholder={intl.formatMessage(messages.address)}/>
      )}
    </Form.Item>
    <Row gutter={20}>
      <Col xs={24} sm={12}>
        <Form.Item>
          {getFieldDecorator(`addresses[${index}].city`, {
          })(
            <Input placeholder={intl.formatMessage(messages.city)}/>
          )}
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item>
          {getFieldDecorator(`addresses[${index}].state`, {
          })(
            <Input placeholder={intl.formatMessage(messages.state)}/>
          )}
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={20}>
      <Col xs={24} sm={12}>
        <Form.Item>
          {getFieldDecorator(`addresses[${index}].postal_code`, {
          })(
            <Input placeholder={intl.formatMessage(messages.postalCode)}/>
          )}
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item>
          {getFieldDecorator(`addresses[${index}].country`, {
          })(
            <Input placeholder={intl.formatMessage(messages.country)}/>
          )}
        </Form.Item>
      </Col>
    </Row>
  </section>

class AddContacts extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addContact(values, this.props.form)
      }
    })
  }

  render() {
    const {intl} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <Row type='flex' gutter={20}>
            <Col xs={24} md={12} className={s.leftColumn}>
              <section className={s.section}>
                <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
                <Form.Item>
                  {getFieldDecorator('contact.title', {
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required)},
                    ],
                  })(
                    <Select placeholder={intl.formatMessage(messages.salutation)}>
                      {SALUTATIONS.map((item) =>
                        <Select.Option key={item} value={item}>{item}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
                <Row gutter={20}>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('contact.first_name', {
                        rules: [
                          {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                        ],
                      })(
                        <Input placeholder={intl.formatMessage(messages.firstName)}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('contact.last_name', {
                        rules: [
                          {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                        ],
                      })(
                        <Input placeholder={intl.formatMessage(messages.lastName)}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  {getFieldDecorator('contact.nickname', {
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required)},
                    ],
                  })(
                    <Input placeholder={intl.formatMessage(messages.nickname)}/>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('contact.relationship', {
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required)},
                    ],
                  })(
                    <Input placeholder={intl.formatMessage(messages.relationship)}/>
                  )}
                </Form.Item>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>{intl.formatMessage(messages.birthday)}</h1>
                <Form.Item>
                  {getFieldDecorator('birthday', {
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required)},
                    ],
                  })(
                    <DatePicker className={s.birthday} format={DATE_FORMAT}/>
                  )}
                </Form.Item>
              </section>
              <AddressSection
                header={intl.formatMessage(messages.homeAddress)}
                getFieldDecorator={getFieldDecorator}
                index={0}
                intl={intl}
              />
              <AddressSection
                header={intl.formatMessage(messages.companyAddress)}
                getFieldDecorator={getFieldDecorator}
                index={1}
                intl={intl}
              />
            </Col>
            <Col xs={24} md={12} className={s.rightColumn}>
              <section className={s.section}>
                <h1 className={s.header}>{intl.formatMessage(messages.reminders)}</h1>
                <Reminders form={this.props.form} intl={intl}/>
              </section>
              <section className={s.section}>
                <h1 className={s.header}>{intl.formatMessage(messages.groups)}</h1>
                <Groups form={this.props.form} intl={intl}/>
              </section>
            </Col>
          </Row>
        </div>
        <div className={s.actionsWrapper}>
          <div className={s.actions}>
            <Button htmlType='submit' type='primary' ghost>
              <PlusIcon/>
              {intl.formatMessage(messages.submit)}
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {
  addContact,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(AddContacts)))
