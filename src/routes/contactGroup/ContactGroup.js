import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input, Table, Popconfirm, message} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactGroup.css'
import {PaginationItem} from '../../components'
import messages from './messages'
import RemoveIcon from '../../static/remove.svg'
import {
  addContactGroup,
  changeSelectedContacts,
  clear,
  editContactGroup,
  getContacts
} from '../../reducers/contactGroup'
import PlusIcon from '../../static/plus.svg'
import formMessages from '../../formMessages'
import {removeContactGroup} from '../../reducers/contactGroups'
import {FloatingLabel} from '../../components';

class ContactGroup extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.groupId) {
          this.props.editContactGroup({title: values.title})
        } else {
          this.props.addContactGroup({title: values.title})
        }
      }
    })
  }

  render() {
    // TODO add loading
    const {contactsCount, groupContacts, page, pageSize, loading, intl, changeSelectedContacts, contacts, getContacts, title, removeContactGroup, currentGroup} = this.props
    const {getFieldDecorator} = this.props.form
    
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
    console.log('contacts',contacts);
    return (
      <React.Fragment>
        <div className={s.container}>
          <Form.Item className={s.groupName}>
            {getFieldDecorator(`title`, {
              initialValue: title,
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
              ],
            })(
              <FloatingLabel
                placeholder={intl.formatMessage(messages.groupName)}
              />
            )}
          </Form.Item>
          <Table
            className={s.contacts}
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
            <Button
              type='primary'
              ghost
              onClick={this.handleSubmit}
            >
              <PlusIcon/>
              {intl.formatMessage(messages.submit)}
            </Button>
            <Popconfirm
              title={intl.formatMessage(messages.confirmRemoving)}
              onConfirm={() => removeContactGroup(currentGroup)}
              okText={intl.formatMessage(messages.acceptRemoving)}
            >
              <Button type='danger' type='primary' ghost style={{float:'right'}}>
                <RemoveIcon/>
                {intl.formatMessage(messages.delete)}
              </Button>
            </Popconfirm>
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
  removeContactGroup,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(ContactGroup)))
