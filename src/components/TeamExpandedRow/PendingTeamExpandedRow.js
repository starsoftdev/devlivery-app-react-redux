import React from 'react'
import {Select, Row, Col, Input, Button} from 'antd'
import {getUserCreatedRoles} from '../../reducers/permissions'
import {updatePendingTeamMemberRole} from '../../reducers/pendingMembers'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './TeamExpandedRow.css'
import messages from './messages'

class TeamExpandedRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      load:false,
      picked: [],
    }
  }
  componentWillReceiveProps(nextprops){
    if(!this.state.load && nextprops.record)
      this.setState({
        load:true,
        //picked:nextprops.record.groups ? nextprops.record.groups.map(item=>item.id+"") :[]
      })
  }
  componentDidMount() {
    this.props.getUserCreatedRoles()
  }

  selectChange = (value) => {
    this.setState({picked: value})
    this.props.updatePendingTeamMemberRole(this.props.record.id ,value)
  }

  render() {
    const {roles,intl} = this.props
    return (
      <Select
        //mode='multiple'
        placeholder={intl.formatMessage(messages.selectGroups)}
        style={{width: '30%', minWidth: 300}}
        onChange={this.selectChange}
        value={this.state.picked}
      >
        {roles && roles.map((role) => <Select.Option className={s.multiple} key={role.id} title={role.name}>{role.name}</Select.Option>)}
      </Select>
    )
  }
}

const mapState = state => ({
  roles: state.permission.user_created_roles,
})

const mapDispatch = {
  updatePendingTeamMemberRole,
  getUserCreatedRoles,
}

export default connect(mapState, mapDispatch)(withStyles(s)(TeamExpandedRow))
