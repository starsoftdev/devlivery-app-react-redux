import React from 'react'
import {connect} from 'react-redux'
import {Col, Input, Pagination, Row, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './EditGroup.css'
import RemoveIcon from '../../static/remove.svg'
import GridIcon from '../../static/view_card.svg'
import ListIcon from '../../static/view_list.svg'
import {PaginationItem} from '../../components'
import debounce from 'lodash/debounce'
import messages from './messages'
import {DEFAULT_DEBOUNCE_TIME} from '../../constants'
import {clear, editGroup, getGroupContacts, removeContactFromGroup} from '../../reducers/contactGroup'

const GRID_VIEW = 'grid'
const LIST_VIEW = 'list'
const pageSizeOptions = ['12', '24', '36', '48']

class EditGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: GRID_VIEW,
      groupName: props.title,
    }

    this.getGroupContacts = debounce(this.props.getGroupContacts, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  changeGroupName = (e) => {
    const groupName = e.target.value
    this.setState({groupName})
  }

  changeView = (view) => {
    this.setState({view})
  }

  render() {
    const {view, groupName} = this.state
    // TODO add loading
    const {groupContactsCount, groupContacts, page, pageSize, loading, getGroupContacts, removeContactFromGroup, intl, editGroup} = this.props

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
        title: intl.formatMessage(messages.actionsColumn),
        dataIndex: '',
        key: 'actions',
        render: (contact) => {
          return (
            <a onClick={() => removeContactFromGroup(contact)}>
              <RemoveIcon/>
            </a>
          )
        }
      },
    ]

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <div className={s.groupNameWrapper}>
            <Input
              className={s.groupName}
              placeholder={intl.formatMessage(messages.groupName)}
              value={groupName}
              onChange={this.changeGroupName}
            />
            <a className={s.editGroupBtn} onClick={() => editGroup({title: groupName})}>
              {intl.formatMessage(messages.editGroup)}
            </a>
          </div>
          <div className={s.views}>
            <a className={s.viewBtn} onClick={() => this.changeView(GRID_VIEW)}>
              <GridIcon/>
            </a>
            <a className={s.viewBtn} onClick={() => this.changeView(LIST_VIEW)}>
              <ListIcon/>
            </a>
          </div>
        </div>
        {view === GRID_VIEW ? (
          <React.Fragment>
            <Row type='flex' gutter={20}>
              {groupContacts.map((contact) =>
                <Col
                  key={contact.id}
                  xs={24}
                  sm={12}
                  md={6}
                >
                  <div className={s.contact}>
                    <a className={s.removeBtn} onClick={() => removeContactFromGroup(contact)}>
                      <RemoveIcon/>
                    </a>
                    <p className={s.contactName}>{contact.first_name} {contact.last_name}</p>
                    <a href={`tel:${contact.phone}`} className={s.contactPhone}>
                      {contact.phone}
                    </a>
                  </div>
                </Col>
              )}
            </Row>
            <div className={s.footer}>
              <Pagination
                current={page}
                total={groupContactsCount}
                showTotal={(total, range) => intl.formatMessage(messages.tableItems, {
                  range0: range[0],
                  range1: range[1],
                  total
                })}
                pageSize={pageSize}
                showSizeChanger
                onChange={(current, pageSize) => getGroupContacts({pagination: {current, pageSize}})}
                onShowSizeChange={(current, pageSize) => getGroupContacts({pagination: {current, pageSize}})}
                itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
                pageSizeOptions={pageSizeOptions}
              />
            </div>
          </React.Fragment>
        ) : (
          <Table
            columns={columns}
            dataSource={groupContacts}
            rowKey={record => record.id}
            onChange={(pagination, filters, sorter) => getGroupContacts({pagination, filters, sorter})}
            pagination={{
              current: page,
              total: groupContactsCount,
              showTotal: (total, range) => intl.formatMessage(messages.tableItems, {
                range0: range[0],
                range1: range[1],
                total
              }),
              pageSize,
              showSizeChanger: true,
              itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>,
              pageSizeOptions,
            }}
          />
        )}
      </div>
    )
  }
}

const mapState = state => ({
  ...state.contactGroup,
})

const mapDispatch = {
  editGroup,
  getGroupContacts,
  removeContactFromGroup,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(EditGroup))
