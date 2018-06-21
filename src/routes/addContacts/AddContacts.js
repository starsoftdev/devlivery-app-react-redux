import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Input, Row, Select, DatePicker} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddContacts.css'
import formMessages from '../../formMessages'
import PlusIcon from '../../static/plus.svg'
import {addContact} from '../../reducers/contacts'
import {DATE_FORMAT} from '../../constants'

const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.']

// TODO add accordion for sections
const AddressSection = ({getFieldDecorator, index, header}) =>
  <section className={s.section}>
    <h1 className={s.header}>{header}</h1>
    <Form.Item>
      {getFieldDecorator(`addresses[${index}].address`, {
      })(
        <Input placeholder={'Address'}/>
      )}
    </Form.Item>
    <Row gutter={20}>
      <Col xs={24} sm={12}>
        <Form.Item>
          {getFieldDecorator(`addresses[${index}].city`, {
          })(
            <Input placeholder={'City'}/>
          )}
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item>
          {getFieldDecorator(`addresses[${index}].state`, {
          })(
            <Input placeholder={'State'}/>
          )}
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={20}>
      <Col xs={24} sm={12}>
        <Form.Item>
          {getFieldDecorator(`addresses[${index}].postal_code`, {
          })(
            <Input placeholder={'Postal Code'}/>
          )}
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item>
          {getFieldDecorator(`addresses[${index}].country`, {
          })(
            <Input placeholder={'Country'}/>
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
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <Row type='flex' gutter={20}>
            <Col xs={24} md={12} className={s.leftColumn}>
              <section className={s.section}>
                <h1 className={s.header}>Add Contact</h1>
                <Form.Item>
                  {getFieldDecorator('contact.title', {
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Select placeholder={'Salutation'}>
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
                          {required: true, message: formMessages.required, whitespace: true},
                        ],
                      })(
                        <Input placeholder={'First Name'}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item>
                      {getFieldDecorator('contact.last_name', {
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
                  {getFieldDecorator('contact.nickname', {
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'Nickname'}/>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('contact.relationship', {
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
                <Form.Item>
                  {getFieldDecorator('birthday', {
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <DatePicker className={s.birthday} format={DATE_FORMAT}/>
                  )}
                </Form.Item>
              </section>
              <AddressSection
                header={'Home Address'}
                getFieldDecorator={getFieldDecorator}
                index={0}
              />
              <AddressSection
                header={'Company Address'}
                getFieldDecorator={getFieldDecorator}
                index={1}
              />
            </Col>
            <Col xs={24} md={12} className={s.rightColumn}>

            </Col>
          </Row>
        </div>
        <div className={s.actionsWrapper}>
          <div className={s.actions}>
            <Button htmlType='submit' type='primary' ghost>
              <PlusIcon/>
              Save Contact
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
