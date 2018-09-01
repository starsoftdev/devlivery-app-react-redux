import React from 'react'
import {connect} from 'react-redux'
import {Col, Input, Pagination, Popconfirm, Row, Select, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Contacts.css'
import EditIcon from '../../static/edit.svg'
import RemoveIcon from '../../static/remove.svg'
import GridIcon from '../../static/view_card.svg'
import ListIcon from '../../static/view_list.svg'
import {Link, PaginationItem, ContactDetail} from '../../components'
import {clear, getContacts, removeContact} from '../../reducers/contacts'
import debounce from 'lodash/debounce'
import messages from './messages'
import {DEFAULT_DEBOUNCE_TIME} from '../../constants'
import {EDIT_CONTACT_ROUTE} from '../'

const GRID_VIEW = 'grid'
const LIST_VIEW = 'list'
const pageSizeOptions = ['12', '24', '36', '48']

class Contacts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: GRID_VIEW,
      search: undefined,
      showContactView: false,
      contactId: null,
    }

    this.getContacts = debounce(this.props.getContacts, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  changeSearch = (e) => {
    const search = e.target.value
    this.setState({search})
    this.getContacts({search})
  }

  changeView = (view) => {
    if(this.props.readonly !== true)
      this.setState({view})
  }

  showDetailContactView = (id) => {
    this.setState({showContactView: true, contactId: id})
  }

  closeDetailContactView = () => {
    this.setState({showContactView: false, contactId: null})
  }

  render() {
    const {view, search, contactId, showContactView} = this.state
    // TODO add loading
    const {contactsCount, contacts, page, pageSize, loading, getContacts, removeContact, intl, ordering, readonly} = this.props

    const columns = [
      {
        title: intl.formatMessage(messages.nameColumn),
        dataIndex: '',
        key: 'name',
        render: (contact) => (
          <a onClick={() => this.showDetailContactView(contact.id)}>
            {`${contact.first_name} ${contact.last_name}`}
          </a>
        )
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
      {
        title: intl.formatMessage(messages.actionsColumn),
        dataIndex: '',
        key: 'actions',
        render: (contact) => {
          return (
            <React.Fragment>
              <Link to={{name: EDIT_CONTACT_ROUTE, params: {contactId: contact.id}}}>
                <EditIcon/>
              </Link>
              <Popconfirm
                title={intl.formatMessage(messages.confirmRemoving)}
                onConfirm={() => removeContact(contact)}
                okText={intl.formatMessage(messages.acceptRemoving)}
              >
                <a className={s.removeIcon}>
                  <RemoveIcon/>
                </a>
              </Popconfirm>
            </React.Fragment>
          )
        }
      },
    ]

    const contactSortBy = [
      {value: 'first_name', label: 'A-Z'},
      {value: '-first_name', label: 'Z-A'},
      {value: '-updated_at', label: 'Last Update Date'},
      {value: '-created_at', label: 'Creation Date'},
      {value: '-dob', label: 'Upcoming birthdays'},
    ]
    
    return (
      <div className={s.container}>
        {
          readonly !== true &&
          <div className={s.actions}>
            <Input.Search
              className={s.search}
              placeholder={intl.formatMessage(messages.search)}
              value={search}
              onChange={this.changeSearch}
            />
            <Select
              className={s.sortBy}
              placeholder={intl.formatMessage(messages.sortBy)}
              onChange={(ordering) => getContacts({ordering})}
              value={ordering}
            >
              {contactSortBy.map(item =>
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              )}
            </Select>
            <div className={s.views}>
              <a className={s.viewBtn} onClick={() => this.changeView(GRID_VIEW)}>
                <GridIcon/>
              </a>
              <a className={s.viewBtn} onClick={() => this.changeView(LIST_VIEW)}>
                <ListIcon/>
              </a>
            </div>
          </div>
        }
        {view === GRID_VIEW ? (
          <React.Fragment>
            <Row type='flex' gutter={20}>
              {contacts.map((contact) =>
                <Col
                  xs={24}
                  sm={12}
                  md={6}
                  key={contact.id}
                >
                  <div className={s.contact}>
                    
                    <Link
                      className={s.gridEditBtn}
                      to={{name: EDIT_CONTACT_ROUTE, params: {contactId: contact.id}}}
                    >
                      <EditIcon/>
                    </Link>
                    <div className={s.contactContent} onClick={() => {
                        if(this.props.selectExistingContact)
                          this.props.selectExistingContact(contact);
                        else
                          this.showDetailContactView(contact.id)
                      }}>
                      <p className={s.contactName}>{contact.first_name} {contact.last_name}</p>
                      <a href={`tel:${contact.phone}`} className={s.contactPhone}>{contact.phone}</a>
                      <a href={`mailto:${contact.email}`} className={s.contactEmail}>{contact.email}</a>
                      {contact.dob && ordering.includes('dob') && (
                        <div className={s.contactBirthday}>Birthday: {contact.dob}</div>
                      )}
                    </div>
                  </div>
                </Col>
              )}
              {
                contacts.length <= 0 &&
                <div>No Contact</div>
              }
            </Row>
            {
              readonly !== true &&
              <div className={s.footer}>
                <Pagination
                  current={page}
                  total={contactsCount}
                  showTotal={(total, range) => intl.formatMessage(messages.tableItems, {range0: range[0], range1: range[1], total})}
                  pageSize={pageSize}
                  showSizeChanger
                  onChange={(current, pageSize) => getContacts({pagination: {current, pageSize}})}
                  onShowSizeChange={(current, pageSize) => getContacts({pagination: {current, pageSize}})}
                  itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
                  pageSizeOptions={pageSizeOptions}
                />
              </div>
            }
          </React.Fragment>
        ) : (
          <Table
            columns={columns}
            dataSource={contacts}
            rowKey={record => record.id}
            onChange={(pagination, filters, sorter) => getContacts({pagination, filters, sorter})}
            pagination={{
              current: page,
              total: contactsCount,
              showTotal: (total, range) => intl.formatMessage(messages.tableItems, {range0: range[0], range1: range[1], total}),
              pageSize,
              showSizeChanger: true,
              itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>,
              pageSizeOptions,
            }}
          />
        )}
        {showContactView && (
          <ContactDetail
            closeDetailContactView={this.closeDetailContactView}
            contactId={contactId}
          />
        )}
      </div>
    )
  }
}

const mapState = state => ({
  ...state.contacts,
})

const mapDispatch = {
  getContacts,
  removeContact,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Contacts))
