import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactForm.css'
import {Col, DatePicker, Input, Row, Select, Form} from 'antd'
import formMessages from '../../formMessages'
import {DATE_FORMAT} from '../../constants'
import messages from './messages'
import {injectIntl} from 'react-intl'
import Reminders from './Reminders'
import Groups from './Groups'
import moment from 'moment'

// TODO add accordion for sections
const AddressSection = ({getFieldDecorator, index, header, intl, initialValues, required, onAddressChange}) => {
  const rules = [
    {required, message: intl.formatMessage(formMessages.required)}
  ]
  return (
    <section className={s.section}>
      <h1 className={s.header}>{header}</h1>
      {initialValues && initialValues.id && getFieldDecorator(`addresses[${index}].id`, {
        initialValue: initialValues.id,
      })(
        <Input type='hidden'/>
      )}
      {getFieldDecorator(`addresses[${index}].title`, {
        initialValue: header,
      })(
        <Input type='hidden'/>
      )}
      <Form.Item>
        {getFieldDecorator(`addresses[${index}].address`, {
          initialValue: initialValues && initialValues.address,
          rules,
        })(
          <Input placeholder={intl.formatMessage(messages.address)} onChange={(e) => onAddressChange(e.target.value)}/>
        )}
      </Form.Item>
      <Row gutter={20}>
        <Col xs={24} sm={12}>
          <Form.Item>
            {getFieldDecorator(`addresses[${index}].city`, {
              initialValue: initialValues && initialValues.city,
              rules,
            })(
              <Input placeholder={intl.formatMessage(messages.city)}/>
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item>
            {getFieldDecorator(`addresses[${index}].state`, {
              initialValue: initialValues && initialValues.state,
              rules,
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
              initialValue: initialValues && initialValues.postal_code,
              rules,
            })(
              <Input placeholder={intl.formatMessage(messages.postalCode)}/>
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item>
            {getFieldDecorator(`addresses[${index}].country`, {
              initialValue: initialValues && initialValues.country,
              rules,
            })(
              <Input placeholder={intl.formatMessage(messages.country)}/>
            )}
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}

const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.']

class ContactForm extends React.Component {
  state = {
    requiredAddress: 0,
  }

  // TODO find a better way to set at least one address required
  changeRequiredAddress = (index, value) => {
    let requiredAddress = index
    if (!value && index === 1) {
      requiredAddress = 0
    } else if (!value && index === 0) {
      requiredAddress = 1
    }
    this.setState({requiredAddress})
  }

  render() {
    const {requiredAddress} = this.state
    const {intl, children, header, initialValues} = this.props
    const {getFieldDecorator} = this.props.form

    const contactSection = (
      <section className={s.section}>
        {header && <h1 className={s.header}>{header}</h1>}
        <Form.Item>
          {getFieldDecorator('contact.title', {
            initialValue: initialValues && initialValues.title ? initialValues.title : undefined,
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
                initialValue: initialValues && initialValues.first_name,
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
                initialValue: initialValues && initialValues.last_name,
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
          {getFieldDecorator('contact.email', {
            initialValue: initialValues && initialValues.email,
            rules: [
              {required: true, message: intl.formatMessage(formMessages.required)},
            ],
          })(
            <Input placeholder={intl.formatMessage(messages.email)}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('contact.phone', {
            initialValue: initialValues && initialValues.phone,
            rules: [
              {required: true, message: intl.formatMessage(formMessages.required)},
            ],
          })(
            <Input placeholder={intl.formatMessage(messages.phone)}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('contact.nickname', {
            initialValue: initialValues && initialValues.nickname,
          })(
            <Input placeholder={intl.formatMessage(messages.nickname)}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('contact.relationship', {
            initialValue: initialValues && initialValues.relationship,
          })(
            <Input placeholder={intl.formatMessage(messages.relationship)}/>
          )}
        </Form.Item>
      </section>
    )

    const birthdaySection = (
      <section className={s.section}>
        <h1 className={s.header}>{intl.formatMessage(messages.birthday)}</h1>
        <Form.Item>
          {getFieldDecorator('birthday', {
            initialValue: initialValues ? moment(initialValues.dob, DATE_FORMAT) : undefined,
          })(
            <DatePicker className={s.birthday} format={DATE_FORMAT}/>
          )}
        </Form.Item>
      </section>
    )

    const homeAddress = intl.formatMessage(messages.homeAddress)
    const companyAddress = intl.formatMessage(messages.companyAddress)

    const homeAddressSection = (
      <AddressSection
        required={requiredAddress === 0}
        onAddressChange={(value) => this.changeRequiredAddress(0, value)}
        header={homeAddress}
        getFieldDecorator={getFieldDecorator}
        index={0}
        intl={intl}
        initialValues={initialValues ? initialValues.addresses.find(item => item.title === homeAddress) : null}
      />
    )

    const companyAddressSection = (
      <AddressSection
        required={requiredAddress === 1}
        onAddressChange={(value) => this.changeRequiredAddress(1, value)}
        header={companyAddress}
        getFieldDecorator={getFieldDecorator}
        index={1}
        intl={intl}
        initialValues={initialValues ? initialValues.addresses.find(item => item.title === companyAddress) : null}
      />
    )

    const remindersSection = (
      <section className={s.section}>
        <h1 className={s.header}>{intl.formatMessage(messages.reminders)}</h1>
        <Reminders form={this.props.form} intl={intl} initialValues={initialValues}/>
      </section>
    )

    const groupsSection = (
      <section className={s.section}>
        <h1 className={s.header}>{intl.formatMessage(messages.groups)}</h1>
        <Groups form={this.props.form} intl={intl} initialValues={initialValues}/>
      </section>
    )

    return children({
      contactSection,
      birthdaySection,
      homeAddressSection,
      companyAddressSection,
      remindersSection,
      groupsSection,
    })
  }
}

export default injectIntl(withStyles(s)(ContactForm))
