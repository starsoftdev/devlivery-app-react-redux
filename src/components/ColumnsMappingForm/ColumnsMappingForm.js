import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ColumnsMappingForm.css'
import {Form, Select} from 'antd'
import {injectIntl} from 'react-intl'
import formMessages from '../../formMessages'
import {REQUIRED_FIELDS} from '../../constants'
import {connect} from 'react-redux'
import messages from './messages'

class ColumnsMappingForm extends React.Component {
  render() {
    const {mappingColumns, intl} = this.props
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
      <Form layout='vertical' hideRequiredMark>
        {mappingColumns.db_columns.map(column =>
          <Form.Item
            className={s.row}
            {...formItemLayout}
            key={column}
            label={column}
          >
            {getFieldDecorator(column, {
              rules: [
                {required: REQUIRED_FIELDS.includes(column), message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Select placeholder={intl.formatMessage(messages.notInFile)}>
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

export default Form.create()(connect(mapState, mapDispatch)(injectIntl(withStyles(s)(ColumnsMappingForm))))
