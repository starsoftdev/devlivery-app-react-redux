import React from 'react'
import { connect } from 'react-redux'
import { Col, Input, Pagination, Popconfirm, Row, Select, Table, Spin, message } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Contacts.css'
import EditIcon from '../../static/edit.svg'
import RemoveIcon from '../../static/remove.svg'
import GridIcon from '../../static/view_card.svg'
import ListIcon from '../../static/view_list.svg'
import { Link, PaginationItem, ContactDetail } from '../../components'
import { clear, getContacts, removeContact, getContactsByName } from '../../reducers/contacts'
import debounce from 'lodash/debounce'
import messages from './messages'
import { DEFAULT_DEBOUNCE_TIME } from '../../constants'
import { EDIT_CONTACT_ROUTE } from '../'
import moment from 'moment'

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
    this.setState({ search })
    this.getContacts({ search })
  }

  changeView = (view) => {
    this.setState({ view })
  }

  showDetailContactView = (id) => {
    this.setState({ showContactView: true, contactId: id })
  }

  closeDetailContactView = () => {
    this.setState({ showContactView: false, contactId: null })
  }

  render() {
    const { view, search, contactId, showContactView } = this.state
    // TODO add loading
    const { contactsCount, contacts, page, pageSize, loading, getContacts, removeContact, intl, ordering, withSearchGroup, contactGroups, getContactsByName } = this.props
    var columns = [
      {
        title: intl.formatMessage(messages.nameColumn),
        dataIndex: '',
        key: 'name',
        render: (contact) => (
          <a onClick={() => {
            if (this.props.selectExistingContact)
              this.props.selectExistingContact(contact);
            else
              this.showDetailContactView(contact.id)
          }}>
            {contact.first_name+' '+contact.last_name}
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
        render: (phone) => (
          <div className={s.phoneItem}>
            {phone}
          </div>
        )
      },
      {
        title: intl.formatMessage(messages.birthdayColumn),
        dataIndex: 'dob',
        key: 'dob',
        render: (dob) => dob
      },
      {
        title: intl.formatMessage(messages.actionsColumn),
        dataIndex: '',
        key: 'actions',
        render: (contact) => {
          return (
            <React.Fragment>
              <Link to={{ name: EDIT_CONTACT_ROUTE, params: { contactId: contact.id } }}>
                <EditIcon />
              </Link>
              <Popconfirm
                title={intl.formatMessage(messages.confirmRemoving)}
                onConfirm={() => {
                  if(contact.is_connected_to_order)
                    message.warn(intl.formatMessage(messages.warningRemoving));
                  else removeContact(contact, true)}
                }
                okText={intl.formatMessage(messages.acceptRemoving)}
              >
                <a className={s.removeIcon}>
                  <RemoveIcon />
                </a>
              </Popconfirm>
            </React.Fragment>
          )
        }
      },
    ]
    if (withSearchGroup) {
      columns = columns.slice(0, columns.length - 2);
    }
    const contactSortBy = [
      { value: 'first_name', label: 'A-Z' },
      { value: '-first_name', label: 'Z-A' },
      { value: '-updated_at', label: intl.locale === "de-DE" ? 'Datum, letzes Update' : 'Last Update Date' },
      { value: '-created_at', label: intl.locale === "de-DE" ? 'Datum hinzufügen' : 'Creation Date' },
      { value: '-dob', label: intl.locale === "de-DE" ? 'anstehende Geburtstage' : 'Upcoming birthdays' },
    ]

    return (
      <div className={s.container}>
        {
          <div className={s.actions}>
            {
              withSearchGroup !== true &&
              <Input.Search
                className={s.search}
                placeholder={intl.formatMessage(messages.search)}
                value={search}
                onChange={this.changeSearch}
              />
            }
            {
              withSearchGroup ?
                <Select
                  className={s.search}
                  placeholder={intl.formatMessage(messages.groupBy)}
                  onChange={(groupname) => {
                    if (groupname)
                      getContactsByName(groupname)
                    else getContacts()
                  }}
                  allowClear
                >
                  {contactGroups.map(item =>
                    <Select.Option key={item.id} value={item.title}>{item.title}</Select.Option>
                  )}
                </Select>
                :
                <Select
                  className={s.sortBy}
                  placeholder={intl.formatMessage(messages.sortBy)}
                  onChange={(ordering) => getContacts({ ordering, search: this.state.search })}
                  value={ordering}
                >
                  {contactSortBy.map(item =>
                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                  )}
                </Select>
            }
            <div className={s.views}>
              <a className={s.viewBtn} onClick={() => this.changeView(GRID_VIEW)}>
                <GridIcon />
              </a>
              <a className={s.viewBtn} onClick={() => this.changeView(LIST_VIEW)}>
                <ListIcon />
              </a>
            </div>
          </div>
        }
        {view === GRID_VIEW ? (
          <Spin spinning={loading.contacts}>
            <React.Fragment>
              <Row type='flex' gutter={20}>
                {contacts.map((contact) =>
                  <Col
                    xs={24}
                    sm={12}
                    md={6}
                    key={contact.id}
                  >
                    <div className={s.contact} title={contact.first_name+'\n'+contact.last_name}>
                      {
                        withSearchGroup !== true &&
                        <Link
                          className={s.gridEditBtn}
                          to={{ name: EDIT_CONTACT_ROUTE, params: { contactId: contact.id } }}
                        >
                          <EditIcon />
                        </Link>
                      }
                      <div className={s.contactContent} onClick={() => {
                        if (this.props.selectExistingContact)
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
                  <div>{intl.formatMessage(messages.nocontact)}</div>
                }
              </Row>
              {
                contacts.length > 0 &&
                <div className={s.footer}>
                  <Pagination
                    current={page}
                    total={contactsCount}
                    showTotal={(total, range) => intl.formatMessage(messages.tableItems, { range0: range[0], range1: range[1], total })}
                    pageSize={pageSize}
                    showSizeChanger
                    onChange={(current, pageSize) => getContacts({ pagination: { current, pageSize } })}
                    onShowSizeChange={(current, pageSize) => getContacts({ pagination: { current, pageSize } })}
                    itemRender={(current, type, el) => <PaginationItem type={type} el={el} />}
                    pageSizeOptions={pageSizeOptions}
                  />
                </div>
              }
            </React.Fragment>
          </Spin>
        ) : (
            <Table
              locale={{ emptyText: 'No Contact' }}
              loading={loading.contacts}
              columns={columns}
              dataSource={contacts}
              rowKey={record => record.id}
              onChange={(pagination, filters, sorter) => getContacts({ pagination, filters, sorter })}
              pagination={{
                current: page,
                total: contactsCount,
                showTotal: (total, range) => intl.formatMessage(messages.tableItems, { range0: range[0], range1: range[1], total }),
                pageSize,
                showSizeChanger: true,
                itemRender: (current, type, el) => <PaginationItem type={type} el={el} />,
                pageSizeOptions,
              }}
            />
          )}
        {showContactView && (
          <ContactDetail
            closeDetailContactView={this.closeDetailContactView}
            contactId={contactId}
            intl={intl}
          />
        )}
      </div>
    )
  }
}

const mapState = state => ({
  ...state.contacts,
  contactGroups: state.contactGroups.contactGroups
})

const mapDispatch = {
  getContacts,
  removeContact,
  clear,
  getContactsByName
}

export default connect(mapState, mapDispatch)(withStyles(s)(Contacts))
