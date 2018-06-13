import React from 'react'
import {connect} from 'react-redux'
import {Calendar, Input, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ManageTeam.css'
import EditIcon from '../../static/edit.svg'

// TODO get team members
const teamMembers = [
  {name: 'Fritz Bucco', invoice: 'ADMIN', group: 'ASSISTANT', account_management: 'READ ONLY', card_management: 'READ ONLY'},
  {name: 'Massimo Ceccaroni', invoice: 'ADMIN', group: 'SECRETARY', account_management: 'READ AND WRITE', card_management: 'READ AND WRITE'},
]

class ManageTeam extends React.Component {
  render() {
    const {membersCount, members, page, pageSize, loading} = this.props
    const columns = [
      {
        title: 'Team Member',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Invoice',
        dataIndex: 'invoice',
        key: 'invoice',
      },
      {
        title: 'Group',
        dataIndex: 'group',
        key: 'group',
      },
      {
        title: 'Account Management',
        dataIndex: 'account_management',
        key: 'account_management',
      },
      {
        title: 'Card Management',
        dataIndex: 'card_management',
        key: 'card_management',
      },
      {
        title: 'Edit',
        dataIndex: '',
        key: 'actions',
        render: () => {
          return (
            <EditIcon/>
          )
        }
      },
    ]

    // TODO add pagination styles
    // !loading.members && membersCount > pageSize ? {
    //         current: page,
    //         defaultCurrent: page,
    //         total: membersCount,
    //         showTotal: (total, range) => 'total items',
    //         pageSize,
    //         defaultPageSize: pageSize,
    //       } : false

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>Manage Team</h1>
        </div>
        <Table
          columns={columns}
          dataSource={teamMembers}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => console.log({pagination, filters, sorter})}
          pagination={false}
        />
      </div>
    )
  }
}

const mapState = state => ({
})

const mapDispatch = {
}

export default connect(mapState, mapDispatch)(withStyles(s)(ManageTeam))
