import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Address.css'
import {Col, Form, Input, Row, Button, Icon} from 'antd'
import formMessages from '../../formMessages'
import {injectIntl} from 'react-intl'
import messages from './messages'
import g from '../../styles/global.css';
import cn from 'classnames'

class Address extends React.Component {
  state ={
    expand: false,
  }
  onExpand(){
    this.setState({expand: !this.state.expand})
  }
  render() {
    const {getFieldDecorator, index, header, intl, initialValues, required, onAddressChange, title} = this.props
    const rules = [
      {required, message: intl.formatMessage(formMessages.required)}
    ]
    
    return (
      <section className={s.section}>
        {/*<h1 className={s.header}>{header}</h1>*/}
        <a onClick={this.onExpand.bind(this)}>
            <h1 className={cn(s.header,g.collapseButton)}>{header}<Icon type={this.state.expand?"up":"down"} className={g.collapseIcon}/></h1>
        </a>
        {
          required &&
          <h4 className={s.required}>{(index==1 ? "Company address": "Home address")+" is required."}</h4>
        }
        {
          <div className={this.state.expand ? s.show: s.hidden}>
          {initialValues && initialValues.id && getFieldDecorator(`addresses[${index}].id`, {
            initialValue: initialValues.id,
          })(
            <Input type='hidden'/>
          )}
          {getFieldDecorator(`addresses[${index}].title`, {
            initialValue: title,
          })(
            <Input type='hidden'/>
          )}
          <Form.Item>
            {getFieldDecorator(`addresses[${index}].address`, {
              initialValue: initialValues && initialValues.address ? (typeof initialValues.address === 'string' ? initialValues.address : initialValues.address[0]) : undefined,
              rules: [
                ...rules,
                {min: 5, message: intl.formatMessage(formMessages.minLength, {length: 5})}
              ],
            })(
              <Input placeholder={intl.formatMessage(index==1 ? messages.companyname: messages.address)+(required?" *":"")} onChange={(e) => onAddressChange(e.target.value)}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator(`addresses[${index}].address2`, {
              initialValue: initialValues && initialValues.address ? (typeof initialValues.address === 'string' ? initialValues.address : initialValues.address[1]) : undefined,
            })(
              <Input placeholder={intl.formatMessage(messages.address)}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator(`addresses[${index}].city`, {
              initialValue: initialValues && initialValues.city,
              rules,
            })(
              <Input placeholder={intl.formatMessage(messages.city)+ (required?" *":'')}/>
            )}
          </Form.Item>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator(`addresses[${index}].postal_code`, {
                  initialValue: initialValues && initialValues.postal_code,
                  rules,
                })(
                  <Input placeholder={intl.formatMessage(messages.postalCode)+ (required?" *":'')}/>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator(`addresses[${index}].country`, {
                  initialValue: initialValues && initialValues.country,
                  rules,
                })(
                  <Input placeholder={intl.formatMessage(messages.country)+ (required?" *":'')}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          </div>
        }
      </section>
    )
  }
}

export default injectIntl(withStyles(s)(Address))
