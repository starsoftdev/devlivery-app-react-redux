import React from 'react'
import { connect } from 'react-redux'
import { Col, Input, Pagination, Popconfirm, Row, Select, Table, Checkbox, message, Spin } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Contacts.css'
import EditIcon from '../../static/edit.svg'
import RemoveIcon from '../../static/remove.svg'
import GridIcon from '../../static/view_card.svg'
import ListIcon from '../../static/view_list.svg'
import { Link, PaginationItem, SectionHeader } from '../../components'
import { clear, getContacts, removeContact, getContactsByName } from '../../reducers/contacts'
import debounce from 'lodash/debounce'
import messages from './messages'
import { DEFAULT_DEBOUNCE_TIME } from '../../constants'
import { EDIT_CONTACT_ROUTE, EDIT_CONTACT_GROUP_ROUTE } from '../'
import { getContactGroups, removeContactGroup } from '../../reducers/contactGroups'
import { setNewRecipients, GROUP_ID_KEY, CONTACT_IDS_KEY, gotoConfirm } from '../../reducers/purchase'
import CheckIcon from '../../static/card_checkmark.svg'
import { updateTeamMemberRole } from '../../reducers/team';
import { SELECT_CONTACTS, SELECT_GROUPS } from '../../reducers/purchase'

const GRID_VIEW = 'grid'
const LIST_VIEW = 'list'
const pageSizeOptions = ['12', '24', '36', '48']
const category = ['Groups', 'Contacts'];

class Contacts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: GRID_VIEW,
      search: undefined,
      contactId: null,
      type: props.mode === SELECT_GROUPS ? category[0] : category[1],
      dataEntry: [],
      datacount: 0,
      page: 1,
      pageSize: 12,
      selGroupId: null,
      selContactIds: []
    }
    this.getContacts = debounce(this.props.getContacts, DEFAULT_DEBOUNCE_TIME)
    this.selectCell = this.selectCell.bind(this);
  }

  componentWillMount() {
    this.loadLocalStorage();
  }
  componentDidMount() {
    this.props.onRef(this)
  }

  async loadLocalStorage() {
    if (this.state.type === category[0])
      this.state.selGroupId = await localStorage.getItem(GROUP_ID_KEY);
    else {
      this.state.selContactIds = await localStorage.getItem(CONTACT_IDS_KEY);

      if (this.state.selContactIds === null) this.state.selContactIds = [];
      else this.state.selContactIds = JSON.parse(this.state.selContactIds);
    }
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
    this.props.clear()
  }

  changeView = (view) => {
    this.setState({ view })
  }
  changeSearch = (e) => {
    const search = e.target.value
    this.setState({search})
    this.getContacts({search})
  }
  selectCell(id) {
    if (this.state.type === category[0])
      this.state.selGroupId = id;
    else {
      if (this.state.selContactIds.includes(id)) {
        var index = this.state.selContactIds.indexOf(id);
        this.state.selContactIds.splice(index, 1);
      }
      else {
        this.state.selContactIds.push(id);
      }
    }
    this.updateTable();
  }
  updateTable() {
    this.setState({
      dataEntry: this.state.dataEntry.map(item => {
        var active = false;
        if (this.state.type === category[0]) {
          if (item.id === this.state.selGroupId)
            active = true;
        } else {
          if (this.state.selContactIds.includes(item.id))
            active = true;
        }
        return { ...item, ...{ checked: active } }
      })
    });
  }
  handleSubmit() {
    if (this.state.type === category[0]) {
      if (this.state.selGroupId === null) {
        message.info("please choose one group.");
        return false;
      }
      var filter = this.state.dataEntry.filter(item => item.id === this.state.selGroupId);
      if (filter && filter.length > 0) {
        this.props.getContactsByName(filter[0].title,
          (data) => {
            if (data && data.length > 0) {
              var recipents = data.map(item => item.id);
              this.props.setNewRecipients(recipents);
              localStorage.setItem(GROUP_ID_KEY, filter[0].id);
              //localStorage.setItem(CONTACT_IDS_KEY, JSON.stringify(recipents))
              if (this.props.recipientMode)
                this.props.gotoConfirm();
              else this.props.nextFlowStep()
              return true;
            }
            else {
              this.setState({ selGroupId: null });
              message.info("The group have no contacts.");
              this.props.setDisableButton(false);
            }
          });
        return true;
      }
      else return false;
    }
    else {
      if (this.state.selContactIds.length <= 0) {
        message.info("please choose contacts.");
        return false;
      }
      this.props.setNewRecipients(this.state.selContactIds);
      localStorage.removeItem(GROUP_ID_KEY);
      //localStorage.setItem(CONTACT_IDS_KEY, JSON.stringify(this.state.selContactIds))
      if (this.props.recipientMode)
        this.props.gotoConfirm();
      else this.props.nextFlowStep()
      return true;
    }
  }
  render() {
    const { view, search, contactId, type, page, pageSize, selGroupId, selContactIds } = this.state
    // TODO add loading
    const { contacts, contactsCount, loading,loading_group, getContacts, removeContact, intl, ordering, withSearchGroup, contactGroups, getContactGroups, removeContactGroup, contactGroupsCount } = this.props


    var srcData = type === category[0] ? contactGroups : contacts;
    var count = type === category[0] ? contactGroupsCount : contactsCount;
    var maps = srcData.map(item => { return { ...item, ...{ checked: false } } });
    var dataEntry = [];
    var datacount = 0;

    dataEntry = maps.map(item => {
      var active = false;
      if (type === category[0]) {
        if (item.id + '' === selGroupId + '')
          active = true;
      } else {
        if (selContactIds.includes(item.id))
          active = true;
      }
      return { ...item, ...{ checked: active } }
    });
    datacount = count;

    this.state.dataEntry = dataEntry;
    this.state.datacount = datacount;

    var columns = [];

    if (type === category[1])
      columns = [
        {
          title: '',
          dataIndex: '',
          key: 'id',
          render: (data) => (
            <Checkbox checked={data.checked} onChange={() => this.selectCell(data.id)} />
          )
        },
        {
          title: intl.formatMessage(messages.nameColumn),
          dataIndex: '',
          key: 'name',
          render: (contact) => (
            <a onClick={() => {

            }}>
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
      ];
    //Group
    else columns = [
      {
        title: '',
        dataIndex: '',
        key: 'id',
        render: (data) => (
          <Checkbox checked={data.checked} onChange={() => this.selectCell(data.id)} />
        )
      },
      {
        title: intl.formatMessage(messages.nameColumn),
        dataIndex: '',
        key: 'title',
        render: (data) => (
          <a onClick={() => {
          }}>
            {`${data.title}`}
          </a>
        )
      },
      {
        title: intl.formatMessage(messages.actionsColumn),
        dataIndex: '',
        key: 'actions',
        render: (data) => {
          return (
            <React.Fragment>
              <Link to={{ name: EDIT_CONTACT_GROUP_ROUTE, params: { groupId: data.id, title: data.title } }}>
                <EditIcon />
              </Link>
              <Popconfirm
                title={intl.formatMessage(messages.confirmRemoving)}
                onConfirm={() => removeContactGroup(data)}
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
    ];

    const contactSortBy = [
      { value: 'first_name', label: 'A-Z' },
      { value: '-first_name', label: 'Z-A' },
      { value: '-updated_at', label: intl.locale === "de-DE" ? 'Datum, letzes Update' : 'Last Update Date' },
      { value: '-created_at', label: intl.locale === "de-DE" ? 'Datum hinzufügen' : 'Creation Date' },
      { value: '-dob', label: intl.locale === "de-DE" ? 'anstehnde Geburtstage' : 'Upcoming birthdays' },
    ]

    return (
      <div className={s.container}>
        {
          <div className={s.actions}>
            <SectionHeader
              header={this.props.headerTitle}
              prefixClassName={s.headerPrefix}
            />
            <div className={s.views}>
              {
                type === category[1] &&
                <Input.Search
                  className={s.search}
                  placeholder={intl.formatMessage(messages.search)}
                  value={search}
                  onChange={this.changeSearch}
                />
              }
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
          <Spin spinning = {loading.contacts || loading_group}>
          <React.Fragment>
            <Row type='flex' gutter={20}>
              {
                dataEntry.map((data) => {
                  return (
                    <Col
                      xs={24}
                      sm={12}
                      md={6}
                      key={data.id}
                    >
                      <div className={s.contact} onClick={() => { this.selectCell(data.id) }}>
                        {data.checked && <CheckIcon className={s.checkIcon} />}
                        {
                          /*
                          type === category[0] ?
                          <Link
                            className={s.gridEditBtn}
                            to={{name: EDIT_CONTACT_GROUP_ROUTE, params: {groupId: data.id, title: data.title}}}>
                          >
                            <EditIcon/>
                          </Link>
                          :
                          <Link
                            className={s.gridEditBtn}
                            to={{name: EDIT_CONTACT_ROUTE, params: {contactId: data.id}}}
                          >
                            <EditIcon/>
                          </Link>
                          */
                        }
                        {
                          type === category[0] ?  //group
                            <div className={s.contactContent}>
                              <p className={s.contactName}>{data.title}</p>
                            </div>
                            : //contacts
                            <div className={s.contactContent} >
                              <p className={s.contactName}>{data.first_name} {data.last_name}</p>
                              <p className={s.contactPhone}>{data.phone}</p>
                              <p className={s.contactEmail}>{data.email}</p>
                              {data.dob && ordering.includes('dob') && (
                                <div className={s.contactBirthday}>Birthday: {data.dob}</div>
                              )}
                            </div>
                        }
                      </div>
                    </Col>
                  )
                }
                )}
            </Row>
            {
              dataEntry.length > 0 &&
              <div className={s.footer}>
                <Pagination
                  current={page}
                  total={datacount}
                  showTotal={(total, range) => intl.formatMessage(messages.tableItems, { range0: range[0], range1: range[1], total })}
                  pageSize={pageSize}
                  showSizeChanger
                  onChange={(current, pageSize) => {
                    this.setState({ page: current, pageSize });
                    type === category[0] ?
                      getContactGroups({ pagination: { current, pageSize } }) :
                      getContacts({ pagination: { current, pageSize } })
                  }}
                  onShowSizeChange={(current, pageSize) => {
                    this.setState({ page: current, pageSize });
                    type === category[0] ?
                      getContactGroups({ pagination: { current, pageSize } }) :
                      getContacts({ pagination: { current, pageSize } })
                  }}
                  itemRender={(current, type, el) => <PaginationItem type={type} el={el} />}
                  pageSizeOptions={pageSizeOptions}
                />
              </div>
            }
          </React.Fragment>
          </Spin>
        ) : (
            <Table
              loading = {loading.contacts || loading_group}
              columns={columns}
              dataSource={dataEntry}
              rowKey={record => record.id}
              onChange={(pagination, filters, sorter) => {
                this.setState({ page: pagination.current, pageSize: pagination.pageSize });
                type === category[0] ?
                  getContactGroups({ pagination: { current: pagination.current, pageSize: pagination.pageSize } }) :
                  getContacts({ pagination: { current: pagination.current, pageSize: pagination.pageSize } })
              }}
              pagination={{
                current: page,
                total: datacount,
                showTotal: (total, range) => intl.formatMessage(messages.tableItems, { range0: range[0], range1: range[1], total }),
                pageSize,
                showSizeChanger: true,
                itemRender: (current, type, el) => <PaginationItem type={type} el={el} />,
                pageSizeOptions,
              }}
            />
          )}
      </div>
    )
  }

}

const mapState = state => ({
  ...state.contacts,
  contactGroups: state.contactGroups.contactGroups,
  loading_group: state.contactGroups.loading,
  contactGroupsCount: state.contactGroups.contactGroupsCount,
  recipientMode: state.purchase.recipientMode,
})

const mapDispatch = {
  getContacts,
  removeContact,
  clear,
  getContactGroups,
  removeContactGroup,
  setNewRecipients,
  getContactsByName,
  gotoConfirm
}

export default connect(mapState, mapDispatch)(withStyles(s)(Contacts))
