import React from 'react'
import {connect} from 'react-redux'
import {Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ManageTeam.css'
import EditIcon from '../../static/edit.svg'
import PlusIcon from '../../static/plus.svg'
import {clear, getTeam} from '../../reducers/team'
import {getPendingTeam} from '../../reducers/pendingMembers'
import {PaginationItem, TeamExpandedRow, PendingTeamExpandedRow} from '../../components'
import messages from './messages'

class ManageTeam extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      invited: null,
      pending: null
    }
  }

  componentWillUnmount() {
    this.props.clear()
  }

  onEditClick = (record, status) => {
    this.setState({[status]: record.id})
  }

  closeEditRow = (status) => {
    this.setState({[status]: null})
  }

  teamSubmit = (e) => {
    e.preventDefault()

  }

  render() {
    // TODO add table loading
    const {
      teamCount,
      team,
      page,
      pageSize,
      getTeam,
      intl,
      pendingMembers,
      getPendingTeam,
    } = this.props

    const columns = [
      {
        title: intl.formatMessage(messages.nameColumn),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: intl.formatMessage(messages.groupColumn),
        dataIndex: 'groups[0].name',
        key: 'groups',
      },
      {
        title: intl.formatMessage(messages.budgetColumn),
        dataIndex: 'budget',
        key: 'budget',
        render: (budget) => {
          if (budget){
            return (<span>{budget.budget}/{budget.total_spent}</span>)
          } else {
            return ''
          }
        }
      },
      {
        title: intl.formatMessage(messages.actionsColumn),
        dataIndex: '',
        key: 'actions',
        render: (record) => {
          return (
            <React.Fragment>
              {this.state.invited !== record.id ?
                <EditIcon onClick={() => this.onEditClick(record, 'invited')}/> :
                <PlusIcon onClick={() => this.closeEditRow('invited')}/>
              }
            </React.Fragment>
          )
        }
      },
    ]

    const columnsPending = [
      {
        title: intl.formatMessage(messages.nameColumn),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: intl.formatMessage(messages.groupColumn),
        dataIndex: 'groups',
        key: 'groups',
      },
      {
        title: intl.formatMessage(messages.senderFirstName),
        dataIndex: 'sender.first_name',
        key: 'first_name',
      },
      {
        title: intl.formatMessage(messages.senderLastName),
        dataIndex: 'sender.last_name',
        key: 'last_name',
      },
      {
        title: intl.formatMessage(messages.actionsColumn),
        dataIndex: '',
        key: 'actions',
        render: (record) => {
          return (
            <React.Fragment>
              {this.state.pending !== record.id ?
                <EditIcon onClick={() => this.onEditClick(record, 'pending')}/> :
                <PlusIcon onClick={() => this.closeEditRow('pending')}/>
              }
            </React.Fragment>
          )
        }
      },
    ]

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
        </div>
        <Table
          columns={columns}
          dataSource={team}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => getTeam({pagination, filters, sorter})}
          expandRowByClick={true}
          expandedRowKeys={[this.state.invited]}
          expandedRowRender={(record) => <TeamExpandedRow record={record}/>}
          pagination={{
            current: page,
            total: teamCount,
            showTotal: (total, range) => intl.formatMessage(messages.tableItems, {range0: range[0], range1: range[1], total}),
            pageSize,
            showSizeChanger: true,
            itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>
          }}
        />

        <div className={s.actions}>
          <h1 className={s.header}>{intl.formatMessage(messages.pendingTableTitle)}</h1>
        </div>
        <Table
          columns={columnsPending}
          dataSource={pendingMembers.team}
          rowKey={(record) => record.id}
          onChange={(pagination, filters, sorter) => getPendingTeam({pagination, filters, sorter})}
          expandRowByClick={true}
          expandedRowKeys={[this.state.pending]}
          expandedRowRender={(record) => <PendingTeamExpandedRow record={record}/>}
          pagination={{
            current: pendingMembers.page,
            total: pendingMembers.teamCount,
            showTotal: (total, range) => intl.formatMessage(messages.tableItems, {range0: range[0], range1: range[1], total}),
            pageSize: pendingMembers.pageSize,
            showSizeChanger: true,
            itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>
          }}
        />
      </div>
    )
  }
}

const mapState = state => ({
  ...state.team,
  pendingMembers: state.pendingMembers,
})

const mapDispatch = {
  getTeam,
  getPendingTeam,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ManageTeam))
