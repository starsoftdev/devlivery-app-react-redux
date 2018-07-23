import React from 'react'
import {Button, Form, Icon, Input, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Groups.css'
import PlusIcon from '../../static/plus.svg'
import {connect} from 'react-redux'
import {getGroups} from '../../reducers/contacts'
import {DEFAULT_DEBOUNCE_TIME} from '../../constants'
import debounce from 'lodash/debounce'
import messages from './messages'
import {createArray} from '../../utils'

// TODO add loading
class Groups extends React.Component {
  uuid = 1

  constructor(props) {
    super(props)

    this.state = {
      groupName: null,
      newGroup: null,
    }

    this.getGroups = debounce(props.getGroups, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillMount () {
    this.props.getGroups()
  }

  componentDidMount () {
    const {initialValues} = this.props
    this.uuid = initialValues && initialValues.length ? initialValues.length : 1
  }

  addGroup = (groupName) => {
    this.setState({
      newGroup: groupName,
      groupName: null,
    })
  }

  removeItem = (k) => {
    const keys = this.props.form.getFieldValue('groupKeys')
    const newKeys = keys.filter(key => key !== k)
    this.props.form.setFieldsValue({groupKeys: newKeys})
  }

  addItem = () => {
    const keys = this.props.form.getFieldValue('groupKeys')
    const newKeys = keys.concat(this.uuid)
    this.uuid++
    this.props.form.setFieldsValue({groupKeys: newKeys})
  }

  render() {
    const {groupName, newGroup} = this.state
    const {groups, loading, intl, initialValues} = this.props
    const {getFieldDecorator, getFieldValue} = this.props.form
    this.props.form.getFieldDecorator('groupKeys', {initialValue: createArray(initialValues && initialValues.length ? initialValues.length : 1)})

    let groupsList = [...groups]

    if (newGroup && !groupName) {
      groupsList = [{title: newGroup}, ...groups.filter(item => item.title !== newGroup)]
    }

    const keys = getFieldValue('groupKeys')
    return (
      <React.Fragment>
        {keys.map((k, i) =>
          <div key={k} className={s.item}>
            {initialValues && initialValues[k] && initialValues[k].id && getFieldDecorator(`groups[${k}].id`, {
              initialValue: initialValues[k].id,
            })(
              <Input type='hidden'/>
            )}
            <Form.Item>
              {getFieldDecorator(`groups[${k}].title`, {
                initialValue: initialValues && initialValues[k] ? initialValues[k].title : undefined,
              })(
                <Select
                  showSearch
                  allowClear
                  placeholder={intl.formatMessage(messages.selectGroup)}
                  notFoundContent={loading.groups ? 'Loading...' : null}
                  filterOption={false}
                  onSearch={(search) => {
                    this.getGroups({search})
                    this.setState({groupName: search})
                  }}
                  onChange={(value, item) => {
                    if (item && +item.key === 0) {
                      this.addGroup(groupName)
                    }
                  }}
                >
                  {groupName && !groupsList.find(item => item.title === groupName) && (
                    <Select.Option key={0} value={groupName}>+ Add "{groupName}"</Select.Option>
                  )}
                  {groupsList.map((item, i) =>
                    <Select.Option key={i + 1} value={item.title}>{item.title}</Select.Option>
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
  getGroups,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Groups))
