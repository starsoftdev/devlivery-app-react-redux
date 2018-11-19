import React from 'react'
import {connect} from 'react-redux'
import {Table, Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ManageTeam.css'
import EditIcon from '../../static/edit.svg'
import PlusIcon from '../../static/plus.svg'
import {clear, getTeam} from '../../reducers/team'
import {getPendingTeam} from '../../reducers/pendingMembers'
import {PaginationItem, TeamExpandedRow, PendingTeamExpandedRow, Link} from '../../components'
import messages from './messages'
import { REGISTER4_ROUTE } from '../../routes';

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
      user,
      loading_team,
      loading_pending,
    } = this.props
    
    const columns = [
      {
        title: intl.formatMessage(messages.nameColumn),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: intl.formatMessage(messages.groupColumn),
        dataIndex: 'groups[0].name',
        key: 'groups',
      },
      {
        title: intl.formatMessage(messages.budgetColumn),
        dataIndex: '',
        key: 'budget',
        render: (record) => {
          if(record.is_team_owner)
            return ''
          if (record.budget){
            return (<span>{record.budget.total_spent}/{record.budget.budget}</span>)
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
                <EditIcon style={{'cursor':'pointer'}} onClick={() => this.onEditClick(record, 'invited')}/> :
                <PlusIcon style={{'cursor':'pointer'}} onClick={() => this.closeEditRow('invited')}/>
              }
            </React.Fragment>
          )
        }
      },
    ]

    var columnsPending = [
      {
        title: intl.formatMessage(messages.nameColumn),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: intl.formatMessage(messages.groupColumn),
        dataIndex: 'groups',
        key: 'groups',
        render: (groups) => {
          if(typeof groups === 'string')
            return groups;
          if(groups === null)
            return;
          var groupstr = '';
          groups.map(item => groupstr += item.name+" ");
          return groupstr;
        }
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
      
    ]
    if(user && user.is_team_owner)
    {
      columnsPending.push({
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
      });
    }
    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
        </div>
        <Table
          loading = {loading_team}
          columns={columns}
          dataSource={team}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => getTeam({pagination, filters, sorter})}
          expandRowByClick={true}
          expandedRowKeys={[this.state.invited]}
          expandedRowRender={(record) => <TeamExpandedRow intl = {intl} record={record}/>}
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
          loading = {loading_pending}
          columns={columnsPending}
          dataSource={pendingMembers.team}
          rowKey={(record) => record.id}
          onChange={(pagination, filters, sorter) => getPendingTeam({pagination, filters, sorter})}
          expandRowByClick={true}
          expandedRowKeys={[this.state.pending]}
          expandedRowRender={(record) => <PendingTeamExpandedRow intl = {intl} record={record}/>}
          pagination={{
            current: pendingMembers.page,
            total: pendingMembers.teamCount,
            showTotal: (total, range) => intl.formatMessage(messages.tableItems, {range0: range[0], range1: range[1], total}),
            pageSize: pendingMembers.pageSize,
            showSizeChanger: true,
            itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>
          }}
        />
        <Link className={s.addteam} to={{name: REGISTER4_ROUTE,params: {fromdashboard:true}}}>
          <Button type='primary' ghost>
            <PlusIcon/>
            {intl.formatMessage(messages.addTeamMember)}
          </Button>
        </Link>
      </div>
    )
  }
}

const mapState = state => ({
  ...state.team,
  pendingMembers: state.pendingMembers,
  loading_team: state.team.loading,
  loading_pending: state.pendingMembers.loading,
  user: state.user.user,
})

const mapDispatch = {
  getTeam,
  getPendingTeam,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ManageTeam))
