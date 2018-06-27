import React from 'react'
import {Button, DatePicker, Form, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Reminders.css'
import PlusIcon from '../../static/plus.svg'
import {DATE_FORMAT, DEFAULT_DEBOUNCE_TIME} from '../../constants'
import {connect} from 'react-redux'
import {getOccasions} from '../../reducers/contacts'
import debounce from 'lodash/debounce'
import messages from './messages'

let uuid = 1

// TODO add loading
class Reminders extends React.Component {
  constructor(props) {
    super(props)

    this.getOccasions = debounce(props.getOccasions, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillMount () {
    this.props.getOccasions()
  }

  // TODO add remove button somewhere
  removeItem = (k) => {
    const keys = this.props.form.getFieldValue('reminderKeys')
    const newKeys = keys.filter(key => key !== k)
    this.props.form.setFieldsValue({reminderKeys: newKeys})
  }

  addItem = () => {
    const keys = this.props.form.getFieldValue('reminderKeys')
    const newKeys = keys.concat(uuid)
    uuid++
    this.props.form.setFieldsValue({reminderKeys: newKeys})
  }

  render() {
    const {occasions, loading, intl} = this.props
    const {getFieldDecorator, getFieldValue} = this.props.form
    this.props.form.getFieldDecorator('reminderKeys', {initialValue: [0]})

    const keys = getFieldValue('reminderKeys')
    return (
      <React.Fragment>
        {keys.map((k) =>
          <div key={k} className={s.item}>
            <Form.Item>
              {getFieldDecorator(`reminders[${k}].occasion_id`, {
              })(
                <Select
                  showSearch
                  allowClear
                  placeholder={intl.formatMessage(messages.occasion)}
                  notFoundContent={loading.occasions ? 'Loading...' : null}
                  filterOption={false}
                  onSearch={(search) => this.getOccasions({search})}
                >
                  {occasions.map(item =>
                    <Select.Option key={item.id} value={item.id}>{item.title}</Select.Option>
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`reminders[${k}].date`, {
              })(
                <DatePicker className={s.date} format={DATE_FORMAT}/>
              )}
            </Form.Item>
          </div>
        )}
        <Button type='primary' ghost onClick={this.addItem}>
          <PlusIcon/>
          {intl.formatMessage(messages.addReminder)}
        </Button>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  occasions: state.contacts.occasions,
  loading: state.contacts.loading,
})

const mapDispatch = {
  getOccasions,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Reminders))
