import React from 'react'
import {Button, Form, Icon, Input, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Groups.css'
import PlusIcon from '../../static/plus.svg'
import {connect} from 'react-redux'
import {getGroups, addGroup} from '../../reducers/contacts'
import {DEFAULT_DEBOUNCE_TIME} from '../../constants'
import debounce from 'lodash/debounce'
import messages from './messages'

let uuid = 1

// TODO add loading
class Groups extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      group: null
    }

    this.getGroups = debounce(props.getGroups, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillMount () {
    this.props.getGroups()
  }

  addGroup = (group, index) => {
    this.props.addGroup(group)
    this.props.form.setFieldsValue({[`groups[${index}].title`]: group})
  }

  // TODO add remove button somewhere
  removeItem = (k) => {
    const keys = this.props.form.getFieldValue('groupKeys')
    const newKeys = keys.filter(key => key !== k)
    this.props.form.setFieldsValue({groupKeys: newKeys})
  }

  addItem = () => {
    const keys = this.props.form.getFieldValue('groupKeys')
    const newKeys = keys.concat(uuid)
    uuid++
    this.props.form.setFieldsValue({groupKeys: newKeys})
  }

  render() {
    const {group} = this.state
    const {groups, loading, intl, initialValues} = this.props
    const {getFieldDecorator, getFieldValue} = this.props.form
    this.props.form.getFieldDecorator('groupKeys', {initialValue: [0]})

    const keys = getFieldValue('groupKeys')
    return (
      <React.Fragment>
        {keys.map((k, i) =>
          <div key={k} className={s.item}>
            {initialValues && initialValues.groups[k] && initialValues.groups[k].id && getFieldDecorator(`groups[${k}].id`, {
              initialValue: initialValues.groups[k].id,
            })(
              <Input type='hidden'/>
            )}
            <Form.Item>
              {getFieldDecorator(`groups[${k}].title`, {
                initialValue: initialValues && initialValues.groups[k] && initialValues.groups[k].title,
              })(
                <Select
                  showSearch
                  allowClear
                  placeholder={intl.formatMessage(messages.selectGroup)}
                  notFoundContent={loading.groups ? 'Loading...' : null}
                  filterOption={false}
                  onSearch={(search) => {
                    this.getGroups({search})
                    this.setState({group: search})
                  }}
                  onChange={(key) => {
                    if (key === group) {
                      this.addGroup(group, k)
                    }
                  }}
                >
                  {group && <Select.Option key={group}>+ Add "{group}"</Select.Option>}
                  {groups.map(item =>
                    <Select.Option key={item.title} value={item.title}>{item.title}</Select.Option>
                  )}
                </Select>
              )}
            </Form.Item>
            {i > 0 && (
              <Icon type='close' onClick={() => this.removeItem(k)} className={s.removeIcon}/>
            )}
          </div>
        )}
        <Button type='primary' ghost onClick={this.addItem}>
          <PlusIcon/>
          {intl.formatMessage(messages.addGroup)}
        </Button>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  groups: state.contacts.groups,
  loading: state.contacts.loading,
})

const mapDispatch = {
  addGroup,
  getGroups,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Groups))
