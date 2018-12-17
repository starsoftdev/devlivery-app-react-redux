import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Address.css'
import {Col, Form, Input, Row, Select, Icon} from 'antd'
import formMessages from '../../formMessages'
import {injectIntl} from 'react-intl'
import messages from './messages'
import g from '../../styles/global.css';
import cn from 'classnames'
import {FloatingLabel} from '../../components';
import {isEmptyData} from '../../utils';
import COUNTRY from '../../messages/country';

class Address extends React.Component {
  constructor(props){
    super(props);
    this.onPressEnter = this.onPressEnter.bind(this);
  }
  onPressEnter(){
    this.props.form.validateFields((err, values) => {
      if(err && hasOwnProperty.call(err, "addresses"))
      {
        var errArray = err["addresses"][this.props.index+''];
        var invalidate = false;
        if(errArray == null || !hasOwnProperty.call(errArray, "address"))
        {
          this.props.onExpand(this.props.index,true);
        }
      }
      else this.props.onExpand(this.props.index,true);
    })
  }
  checkingEmptyForm(index){
    const {getFieldValue} = this.props.form;
    if(
      isEmptyData(getFieldValue(`addresses[${index}].address`)) &&
      isEmptyData(getFieldValue(`addresses[${index}].address2`)) &&
      isEmptyData(getFieldValue(`addresses[${index}].city`))&&
      isEmptyData(getFieldValue(`addresses[${index}].postal_code`)) &&
      isEmptyData (getFieldValue(`addresses[${index}].country`))
      )
    {
      //this.props.onExpand(this.props.index,true);
      return true;
    }
    return false;
  }
  render() {
    const {getFieldDecorator, index, header, intl, initialValues, required, onAddressChange, title, collapseActiveIndex} = this.props
    const innerRequire = !this.checkingEmptyForm(index);
    const rules = [
      {required : innerRequire, message: intl.formatMessage(formMessages.required)}
    ]
    const expand = collapseActiveIndex === index ? true : false;
    
    return (
      <section className={s.section}>
        {/*<h1 className={s.header}>{header}</h1>*/}
        <a onClick={()=>this.props.onExpand(index)}>
            <h1 className={cn(s.header,g.collapseButton)}>{header}<Icon type={expand?"up":"down"} className={g.collapseIcon}/></h1>
        </a>
        {
          <div className={expand ? s.show: s.hidden}>
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
              initialValue: initialValues && (index==1 ? initialValues.company_name : (initialValues.address ? (typeof initialValues.address === 'string' ? initialValues.address : initialValues.address[0]) : undefined)),
            })(
              <FloatingLabel placeholder={intl.formatMessage(index==1 ? messages.companyname: messages.address0)+(required?" *":"")} onChange={(e) => onAddressChange(e.target.value)}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator(`addresses[${index}].address2`, {
              initialValue: initialValues && initialValues.address ? (typeof initialValues.address === 'string' ? initialValues.address : initialValues.address[index==1 ? initialValues.address.length-1:1]) : undefined,
              rules: [
                {required: required && innerRequire, min: 5, message: intl.formatMessage(formMessages.minLength, {length: 5})}
              ],
            })(
              <FloatingLabel placeholder={intl.formatMessage(messages.address)+ (index==1 && required ? " *":'')}/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator(`addresses[${index}].city`, {
              initialValue: initialValues && initialValues.city,
              rules,
            })(
              <FloatingLabel placeholder={intl.formatMessage(messages.city)+ (required?" *":'')}/>
            )}
          </Form.Item>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator(`addresses[${index}].postal_code`, {
                  initialValue: initialValues && initialValues.postal_code,
                  rules,
                })(
                  <FloatingLabel placeholder={intl.formatMessage(messages.postalCode)+ (required?" *":'')}/>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator(`addresses[${index}].country`, {
                  initialValue: initialValues && initialValues.country ? initialValues.country : undefined,
                  rules,
                })(
                  <Select
                    allowClear
                    placeholder={intl.formatMessage(messages.country)+ (required?" *":'')}
                    className={s.country_select}
                  >
                    {COUNTRY[intl.locale].map((item) =>
                      <Select.Option key={item.split('|')[1]} value={item.split('|')[1]}>{item.split('|')[1]}</Select.Option>
                    )}
                  </Select>
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
