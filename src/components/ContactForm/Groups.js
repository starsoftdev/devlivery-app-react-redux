import React from 'react'
import {Button, Form, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Groups.css'
import PlusIcon from '../../static/plus.svg'
import {connect} from 'react-redux'
import {getGroups} from '../../reducers/contacts'
import {DEFAULT_DEBOUNCE_TIME} from '../../constants'
import debounce from 'lodash/debounce'
import messages from './messages'

let uuid = 1

// TODO add loading
class Groups extends React.Component {
  constructor(props) {
    super(props)

    this.getGroups = debounce(props.getGroups, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillMount () {
    this.props.getGroups()
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
    const {groups, loading, intl} = this.props
    const {getFieldDecorator, getFieldValue} = this.props.form
    this.props.form.getFieldDecorator('groupKeys', {initialValue: [0]})

    const keys = getFieldValue('groupKeys')
    return (
      <React.Fragment>
        {keys.map((k) =>
          <div key={k} className={s.item}>
            <Form.Item>
              {getFieldDecorator(`groups[${k}].title`, {
              })(
                <Select
                  showSearch
                  allowClear
                  placeholder={intl.formatMessage(messages.selectGroup)}
                  notFoundContent={loading.groups ? 'Loading...' : null}
                  filterOption={false}
                  onSearch={(search) => this.getGroups({search})}
                >
                  {groups.map(item =>
                    <Select.Option key={item.title} value={item.title}>{item.title}</Select.Option>
                  )}
                </Select>
              )}
            </Form.Item>
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
