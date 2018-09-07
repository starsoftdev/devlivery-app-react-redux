import React from 'react'
import {Select, Row, Col, Input, Button} from 'antd'
import {getRole} from '../../reducers/permissions'
import {updatePendingTeamMemberRole} from '../../reducers/pendingMembers'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './TeamExpandedRow.css'

class TeamExpandedRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      picked: [],
    }
  }

  componentDidMount() {
    this.props.getRole()
  }

  selectChange = (value) => {
    this.setState({picked: value})
    this.props.updatePendingTeamMemberRole(this.props.record.id ,value.join(',')+'')
  }

  render() {
    const {roles} = this.props
    return (
      <Select
        mode='multiple'
        placeholder='Select groups'
        style={{width: '100%'}}
        onChange={this.selectChange}
      >
        {roles && roles.map((role) => <Select.Option className={s.multiple} key={role.id} title={role.name}>{role.name}</Select.Option>)}
      </Select>
    )
  }
}

const mapState = state => ({
  roles: state.permission.groups,
  user: state.user,
})

const mapDispatch = {
  updatePendingTeamMemberRole,
  getRole,
}

export default connect(mapState, mapDispatch)(withStyles(s)(TeamExpandedRow))
