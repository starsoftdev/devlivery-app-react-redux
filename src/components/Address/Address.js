import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Address.css'
import {Col, Form, Input, Row} from 'antd'
import formMessages from '../../formMessages'
import {injectIntl} from 'react-intl'
import messages from './messages'

const Address = ({getFieldDecorator, index, header, intl, initialValues, required, onAddressChange}) => {
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
          rules: [
            ...rules,
            {min: 5, message: intl.formatMessage(formMessages.minLength, {length: 5})}
          ],
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

export default injectIntl(withStyles(s)(Address))
