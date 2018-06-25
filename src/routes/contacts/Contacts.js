import React from 'react'
import {connect} from 'react-redux'
import {Col, Input, Pagination, Row, Select, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Contacts.css'
import EditIcon from '../../static/edit.svg'
import RemoveIcon from '../../static/remove.svg'
import GridIcon from '../../static/view_card.svg'
import ListIcon from '../../static/view_list.svg'
import {PaginationItem} from '../../components'
import {clear, getContacts, removeContact} from '../../reducers/contacts'
import debounce from 'lodash/debounce'
import messages from './messages'
import {DEFAULT_DEBOUNCE_TIME} from '../../constants'

const GRID_VIEW = 'grid'
const LIST_VIEW = 'list'

class Contacts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: GRID_VIEW,
      search: undefined,
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
    this.setState({view})
  }

  render() {
    const {view, search} = this.state
    // TODO add loading
    // TODO add sort_by
    const {contactsCount, contacts, page, pageSize, loading, getContacts, removeContact, intl} = this.props

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
        render: () => {
          return (
            <EditIcon/>
          )
        }
      },
    ]

    return (
      <div className={s.container}>
        <div className={s.actions}>
          {/*TODO add search icon*/}
          <Input
            className={s.search}
            placeholder={intl.formatMessage(messages.search)}
            value={search}
            onChange={this.changeSearch}
          />
          <Select className={s.sortBy} placeholder={intl.formatMessage(messages.sortBy)}>
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
        {view === GRID_VIEW ? (
          <React.Fragment>
            <Row type='flex' gutter={20}>
              {contacts.map((contact) =>
                <Col
                  key={contact.id}
                  xs={24}
                  sm={12}
                  md={6}
                >
                  <div className={s.contact}>
                    <a className={s.editBtn}>
                      <EditIcon/>
                    </a>
                    <a className={s.removeBtn} onClick={() => removeContact(contact)}>
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
                total={contactsCount}
                showTotal={(total, range) => intl.formatMessage(messages.tableItems, {range0: range[0], range1: range[1], total})}
                pageSize={pageSize}
                showSizeChanger
                onChange={(page, pageSize) => getContacts({page, pageSize})}
                onShowSizeChange={(page, pageSize) => getContacts({page, pageSize})}
                itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
              />
            </div>
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
              itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>
            }}
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
