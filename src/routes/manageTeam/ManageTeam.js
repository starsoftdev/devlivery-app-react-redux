import React from 'react'
import {connect} from 'react-redux'
import {Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ManageTeam.css'
import EditIcon from '../../static/edit.svg'
import {clear, getTeam} from '../../reducers/team'
import {PaginationItem} from '../../components'
import messages from './messages'

class ManageTeam extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    // TODO add table loading
    const {teamCount, team, page, pageSize, loading, getTeam, intl} = this.props
    const columns = [
      {
        title: intl.formatMessage(messages.nameColumn),
        dataIndex: 'name',
        key: 'name',
      },
      // TODO add all fields on backend
      {
        title: intl.formatMessage(messages.invoiceColumn),
        dataIndex: 'invoice',
        key: 'invoice',
      },
      {
        title: intl.formatMessage(messages.groupColumn),
        dataIndex: 'group',
        key: 'group',
      },
      {
        title: intl.formatMessage(messages.accountManagementColumn),
        dataIndex: 'account_management',
        key: 'account_management',
      },
      {
        title: intl.formatMessage(messages.cardManagementColumn),
        dataIndex: 'card_management',
        key: 'card_management',
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
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
        </div>
        <Table
          columns={columns}
          dataSource={team}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => getTeam({pagination, filters, sorter})}
          pagination={{
            current: page,
            total: teamCount,
            showTotal: (total, range) => intl.formatMessage(messages.tableItems, {range0: range[0], range1: range[1], total}),
            pageSize,
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
})

const mapDispatch = {
  getTeam,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ManageTeam))
