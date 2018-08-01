import React from 'react'
import {connect} from 'react-redux'
import {Button, Input, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactGroup.css'
import {PaginationItem} from '../../components'
import messages from './messages'
import {
  addContactGroup,
  editContactGroup,
  changeSelectedContacts,
  clear,
  getContacts,
} from '../../reducers/contactGroup'
import PlusIcon from '../../static/plus.svg'

class ContactGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      groupName: props.title,
    }
  }

  componentWillUnmount() {
    this.props.clear()
  }

  changeGroupName = (e) => {
    const groupName = e.target.value
    this.setState({groupName})
  }

  render() {
    const {groupName} = this.state
    // TODO add loading
    const {contactsCount, groupContacts, page, pageSize, loading, intl, addContactGroup, changeSelectedContacts, contacts, getContacts, groupId, editContactGroup} = this.props

    const columns = [
      {
        title: intl.formatMessage(messages.nameColumn),
        dataIndex: '',
        key: 'name',
        render: (contact) => `${contact.first_name} ${contact.last_name}`
      },
      {
        title: intl.formatMessage(messages.emailColumn),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: intl.formatMessage(messages.phoneColumn),
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: intl.formatMessage(messages.birthdayColumn),
        dataIndex: 'dob',
        key: 'dob',
      },
    ]

    return (
      <React.Fragment>
        <div className={s.container}>
          <Input
            className={s.groupName}
            placeholder={intl.formatMessage(messages.groupName)}
            value={groupName}
            onChange={this.changeGroupName}
          />
          <Table
            columns={columns}
            dataSource={contacts}
            rowKey={record => record.id}
            onChange={(pagination, filters, sorter) => getContacts({pagination, filters, sorter})}
            rowSelection={{
              selectedRowKeys: groupContacts,
              onChange: changeSelectedContacts,
            }}
            pagination={{
              current: page,
              total: contactsCount,
              showTotal: (total, range) => intl.formatMessage(messages.tableItems, {
                range0: range[0],
                range1: range[1],
                total
              }),
              pageSize,
              itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>,
            }}
          />
        </div>
        <div className={s.actionsWrapper}>
          <div className={s.actions}>
            <Button type='primary' ghost onClick={() => groupId ? editContactGroup({title: groupName}) : addContactGroup({title: groupName})}>
              <PlusIcon/>
              {intl.formatMessage(messages.submit)}
            </Button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  ...state.contactGroup,
})

const mapDispatch = {
  getContacts,
  addContactGroup,
  editContactGroup,
  changeSelectedContacts,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ContactGroup))
