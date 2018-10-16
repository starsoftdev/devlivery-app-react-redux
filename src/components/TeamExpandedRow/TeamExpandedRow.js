import React from 'react'
import { Select, Row, Col, Input, Button } from 'antd'
import { getUserCreatedRoles } from '../../reducers/permissions'
import { addBudget, reduceAmountBudget, addAmountBudget, deleteBudget, updateTeamMemberRole } from '../../reducers/team'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './TeamExpandedRow.css'
import { FloatingLabel } from '../../components';
import { getUserPermission, hasAnyPermission, getPermissionsOfSpecialRole } from '../../reducers/permissions'
import {isHavePaymentPermission} from '../../utils';
import messages from './messages'

class TeamExpandedRow extends React.Component {
  constructor(props) {
    super(props)
    const groupid = props.record && props.record.groups.length > 0 && props.record.groups[0].id;
    this.state = {
      picked: groupid ? groupid : undefined,
      budget: this.props.record.budget ? this.props.record.budget.budget : '',
      amountAdd: '',
      amountReduce: '',
      payment_permission: null,
      special_payment_permission: false
    }
    if (groupid)
      props.getPermissionsOfSpecialRole(groupid);
  }

  componentWillReceiveProps(nextprops) {

    if (!this.state.load && nextprops.record)
      this.setState({
        load: true,
        //picked:nextprops.record.groups ? nextprops.record.groups.map(item=>item.id+"") :[]
      })

    if (nextprops && nextprops.user_permissions) {
      if (nextprops.user_permissions.hasOwnProperty('Payments')) {
        this.setState({ payment_permission: isHavePaymentPermission(nextprops.user_permissions) });
      }
    }

    if (nextprops && nextprops.selectedPermissions && this.state.picked !== undefined && nextprops.selectedPermissions.id === this.state.picked) {
      this.setState({ special_payment_permission: isHavePaymentPermission(nextprops.selectedPermissions.data) });
    }

  }
  
  componentDidMount() {
    this.props.getUserPermission();
    this.props.getUserCreatedRoles()
  }

  selectChange = (value) => {
    this.props.getPermissionsOfSpecialRole(value);
    this.setState({ picked: value })
    this.props.updateTeamMemberRole(this.props.record.id, value)
  }

  budgetInput = (e) => {
    this.setState({ budget: e.target.value })
  }

  addAmountInput = (e) => {
    this.setState({ amountAdd: e.target.value })
  }

  reduceAmountInput = (e) => {
    this.setState({ amountReduce: e.target.value })
  }

  deleteBudgetHendler = (id) => {
    this.props.deleteBudget(id)
    this.setState({ budget: '' })
  }

  addAmountBudgetHandler = (id, amount) => {
    this.props.addAmountBudget(id, amount)
    this.setState({ amountAdd: '' })
  }

  reduceAmountBudgetHandler = (id, amount) => {
    this.props.reduceAmountBudget(id, amount)
    this.setState({ amountReduce: '' })
  }

  render() {
    const { record, roles, addBudget, user_permissions, user, intl } = this.props
    const { payment_permission, special_payment_permission } = this.state;
    var payment_enable = this.state.picked !== undefined && payment_permission && special_payment_permission;
    if(user && user.is_team_owner === true)
    {
      payment_enable = true;
    }
    if(record.is_team_owner == true)
      payment_enable = false;
    return (
      <Row className={s.container}>
        <Col md={12} className={s.column}>
          <div className={s.leftInputRow}>
            <Select
              //mode='multiple'
              placeholder={intl.formatMessage(messages.selectGroups)}
              style={{ width: '100%' }}
              onChange={this.selectChange}
              value={roles.filter(item => item.id === this.state.picked).length > 0 ? this.state.picked : undefined}
              disabled={user && user.id === record.id}
            >
              {roles && roles.map((role) =>
                <Select.Option className={s.multiple} key={role.id} value={role.id} title={role.name}>
                  {role.name}
                </Select.Option>)}
            </Select>
          </div>
          {!record.budget && payment_enable && <div className={s.leftInputRow}>
            <FloatingLabel
              className={s.amountInput}
              onChange={this.budgetInput}
              value={this.state.budget}
              type='text'
              placeholder='budget'
            />
            <Button
              onClick={() => addBudget(record.id, this.state.budget)}
              type='primary'
            >
              Add budget
            </Button>
          </div>}
        </Col>
        <Col md={12} className={s.column}>
          {record.budget && payment_enable &&
            <React.Fragment>
              <div className={s.leftInputRow}>
                <FloatingLabel
                  className={s.amountInput}
                  onChange={this.addAmountInput}
                  value={this.state.amountAdd}
                  type='text'
                  placeholder='Add amount'
                />
                <Button
                  onClick={() => this.addAmountBudgetHandler(record.budget.id, this.state.amountAdd)}
                  type='primary'
                >
                  Add amount
              </Button>
              </div>
              <div className={s.leftInputRow}>
                <FloatingLabel
                  className={s.amountInput}
                  value={this.state.amountReduce}
                  onChange={this.reduceAmountInput}
                  type='text'
                  placeholder='Reduce amount'
                />
                <Button
                  value={this.state.amountReduce}
                  onClick={() => this.reduceAmountBudgetHandler(record.budget.id, this.state.amountReduce)}
                  type='primary'
                >
                  Reduce amount
              </Button>
              </div>
              <Button
                onClick={() => this.deleteBudgetHendler(record.budget.id)}
                type='primary'
                ghost
              >
                Delete budget
            </Button>
            </React.Fragment>}
        </Col>
      </Row>
    )
  }
}

const mapState = state => ({
  roles: state.permission.user_created_roles,
  user_permissions: state.permission.user_permissions,
  user: state.user.user,
  selectedPermissions: state.permission.specialPermissions,
})

const mapDispatch = {
  addBudget,
  updateTeamMemberRole,
  addAmountBudget,
  reduceAmountBudget,
  deleteBudget,
  getUserCreatedRoles,
  getUserPermission,
  getPermissionsOfSpecialRole
}

export default connect(mapState, mapDispatch)(withStyles(s)(TeamExpandedRow))
