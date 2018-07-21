import React from 'react'
import {Button, DatePicker, Form, Icon, Input, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Reminders.css'
import PlusIcon from '../../static/plus.svg'
import {DATE_FORMAT, DEFAULT_DEBOUNCE_TIME} from '../../constants'
import {connect} from 'react-redux'
import {getOccasions} from '../../reducers/contacts'
import debounce from 'lodash/debounce'
import messages from './messages'
import moment from 'moment/moment'

let uuid = 1

// TODO add loading
class Reminders extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      occasionTitle: null,
      newOccasion: null,
    }

    this.getOccasions = debounce(props.getOccasions, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillMount () {
    this.props.getOccasions()
  }

  addOccasion = (occasionTitle) => {
    this.setState({
      newOccasion: occasionTitle,
      occasionTitle: null,
    })
  }

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
    const {occasionTitle, newOccasion} = this.state
    const {occasions, loading, intl, initialValues} = this.props
    const {getFieldDecorator, getFieldValue} = this.props.form
    this.props.form.getFieldDecorator('reminderKeys', {initialValue: [0]})

    let occasionsList = [...occasions]

    if (newOccasion && !occasionTitle) {
      occasionsList = [{title: newOccasion}, ...occasions.filter(item => item.title !== newOccasion)]
    }

    const keys = getFieldValue('reminderKeys')
    return (
      <React.Fragment>
        {keys.map((k, i) =>
          <div key={k} className={s.item}>
            {initialValues && initialValues.reminders[k] && initialValues.reminders[k].id && getFieldDecorator(`reminders[${k}].id`, {
              initialValue: initialValues.reminders[k].id,
            })(
              <Input type='hidden'/>
            )}
            <Form.Item>
              {getFieldDecorator(`reminders[${k}].occasion_id`, {
                initialValue: initialValues && initialValues.reminders[k] && initialValues.reminders[k].occasion_id,
              })(
                <Select
                  showSearch
                  allowClear
                  placeholder={intl.formatMessage(messages.occasion)}
                  notFoundContent={loading.occasions ? 'Loading...' : null}
                  filterOption={false}
                  onSearch={(search) => {
                    this.getOccasions({search})
                    this.setState({occasionTitle: search})
                  }}
                  onChange={(value, {key}) => {
                    if (+key === 0) {
                      this.addOccasion(occasionTitle)
                    }
                  }}
                >
                  {occasionTitle && !occasionsList.find(item => item.title === occasionTitle) && (
                    <Select.Option key={0} value={occasionTitle}>+ Add "{occasionTitle}"</Select.Option>
                  )}
                  {occasionsList.map((item, i) =>
                    <Select.Option key={i + 1} value={item.title}>{item.title}</Select.Option>
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`reminders[${k}].date`, {
                initialValue: initialValues && initialValues.reminders[k] ? moment(initialValues.reminders[k].date, DATE_FORMAT) : undefined,
              })(
                <DatePicker className={s.date} format={DATE_FORMAT}/>
              )}
            </Form.Item>
            {i > 0 && (
              <Icon type='close' onClick={() => this.removeItem(k)} className={s.removeIcon}/>
            )}
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
