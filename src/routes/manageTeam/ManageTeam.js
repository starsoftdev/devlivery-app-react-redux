import React from 'react'
import {connect} from 'react-redux'
import {Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ManageTeam.css'
import EditIcon from '../../static/edit.svg'
import {clear, getTeam} from '../../reducers/team'
import {PaginationItem} from '../../components'

class ManageTeam extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    // TODO add table loading
    const {teamCount, team, page, pageSize, loading, getTeam} = this.props
    const columns = [
      {
        title: 'Team Member',
        dataIndex: 'name',
        key: 'name',
      },
      // TODO add all fields on backend
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

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>Manage Team</h1>
        </div>
        <Table
          columns={columns}
          dataSource={team}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => getTeam({pagination, filters, sorter})}
          pagination={{
            current: page,
            total: teamCount,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
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
