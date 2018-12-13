import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ColumnsMappingForm.css'
import {Form, Select} from 'antd'
import {injectIntl} from 'react-intl'
import formMessages from '../../formMessages'
import {REQUIRED_FIELDS} from '../../constants'
import {connect} from 'react-redux'
import messages from './messages'
import {contact_map,address_map} from '../../constants';

class ColumnsMappingForm extends React.Component {
  render() {
    const {mappingColumns, intl, className, isRequireAddress} = this.props
    const {getFieldDecorator} = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    
    return (
      <Form layout='vertical' hideRequiredMark className={className}>
        {contact_map.map(column =>
          <Form.Item
            className={s.row}
            {...formItemLayout}
            key={column}
            label={column === 'dob' ? 'date of birth' : column}
          >
            {getFieldDecorator(column, {
              rules: [
                {required: REQUIRED_FIELDS.includes(column), message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Select
                allowClear
                placeholder={intl.formatMessage(messages.notInFile)}
              >
                {mappingColumns && mappingColumns.user_columns.map(item =>
                  <Select.Option key={item}>{item === 'dob' ? 'date of birth' : item}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
        )}
        <h4 className={isRequireAddress? s.requirAddress :s.norequirAddress}>{intl.formatMessage(messages.requireadres)}</h4>
        <h1 className={s.header}>{intl.formatMessage(messages.homeAddress)}</h1>
        {address_map.map(column =>
          <Form.Item
            className={s.row}
            {...formItemLayout}
            key={column}
            label={column}
          >
            {getFieldDecorator('home_'+column, {
              rules: [
                {required: false, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Select
                allowClear
                placeholder={intl.formatMessage(messages.notInFile)}
              >
                {mappingColumns.user_columns.map(item =>
                  <Select.Option key={item}>{item}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
        )}
        <h1 className={s.header}>{intl.formatMessage(messages.companyAddress)}</h1>
        <Form.Item
            className={s.row}
            {...formItemLayout}
            label={'company name'}
          >
          {getFieldDecorator('company', {
            rules: [
              {required: false, message: intl.formatMessage(formMessages.required)},
            ],
          })(
            <Select
              allowClear
              placeholder={intl.formatMessage(messages.notInFile)}
            >
              {mappingColumns.user_columns.map(item =>
                <Select.Option key={item}>{item}</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        {address_map.map(column =>
          <Form.Item
            className={s.row}
            {...formItemLayout}
            key={column}
            label={column}
          >
            {getFieldDecorator('office_'+column, {
              rules: [
                {required: false, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Select
                allowClear
                placeholder={intl.formatMessage(messages.notInFile)}
              >
                {mappingColumns.user_columns.map(item =>
                  <Select.Option key={item}>{item}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
        )}
      </Form>
    )
  }
}

const mapState = state => ({
  mappingColumns: state.contacts.mappingColumns,
})

const mapDispatch = {
}

export default Form.create()(injectIntl(connect(mapState, mapDispatch)(withStyles(s)(ColumnsMappingForm))))
