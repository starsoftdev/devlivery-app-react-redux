import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './GroupPermissions.css'
import {PaginationItem} from '../../components'
import {Input, Table, Row, Col} from 'antd'
import messages from './messages'
import {TablePermission} from '../../components'
import {getTeamRole, getPermissions, changeNewRoleGroup, addGroup, removeGroup, setPermissions} from '../../reducers/permissions'
import PlusIcon from '../../static/plus.svg'

class GroupPermissions extends React.Component {

  componentDidMount() {
    this.props.getTeamRole()
    this.props.getPermissions()
  }

  render() {
    // TODO add table loading
    const {addGroup, setPermissions, newRoleGroup, changeNewRoleGroup, intl, removeGroup, permissions} = this.props
    const groups = this.props.groups

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <div className={s.titleWrapper}>
            <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
            <div className={s.newGroupNameWrapper}>
              <Input
                className={s.newGroupName}
                placeholder={intl.formatMessage(messages.groupName)}
                value={newRoleGroup}
                onChange={(e) => changeNewRoleGroup(e.target.value)}
              />
              <a className={s.addBtn} onClick={addGroup}>
                <PlusIcon className={s.addIcon}/>
                {intl.formatMessage(messages.addGroup)}
              </a>
            </div>
          </div>
        </div>
        <TablePermission
          removeGroup={removeGroup}
          intl={intl}
          groups={groups}
          permissions={permissions}
          setPermissions={setPermissions}
        />
      </div>
    )
  }
}

const mapState = state => ({
  ...state.permission,
})

const mapDispatch = {
  addGroup,
  changeNewRoleGroup,
  getTeamRole,
  getPermissions,
  removeGroup,
  setPermissions,
}

export default connect(mapState, mapDispatch)(withStyles(s)(GroupPermissions))
