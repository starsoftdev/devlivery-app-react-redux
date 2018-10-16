import React from 'react'
import {Row, Col, Checkbox} from 'antd'
import messages from "../../routes/groupPermissions/messages"
import withStyles from "isomorphic-style-loader/lib/withStyles"
import s from './TablePermission.css'
import PlusIcon from '../../static/plus.svg'
import RemoveIcon from '../../static/remove.svg'
import EditIcon from '../../static/edit.svg'
import _ from 'lodash'
import groupby from 'lodash.groupby'
import {connect} from 'react-redux'
import {getPermissionsOfSpecialRole} from '../../reducers/permissions'

const CheckboxGroup = Checkbox.Group;

class PermissionsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showEditForm: null,
      pickedPermissions: {},
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps && nextProps.selectedPermissions && nextProps.selectedPermissions.id === this.state.showEditForm){
      var pickedPermissions = {};
      var p_data = nextProps.selectedPermissions.data;
      for(var key in p_data)
      {
        var each_permission = [];
        p_data[key].map(item => {
          each_permission.push(item.id);
        });
        pickedPermissions[key.toLowerCase()] = each_permission;
      }
      this.setState({pickedPermissions});
    }
  }
  editGroup = (id) => {
    this.setState({showEditForm: id})
    this.props.getPermissionsOfSpecialRole(id);
  }

  submitGroup = (group) => {
    if(group.editable)
    {
      const permissions = _.flatten(Object.values(this.state.pickedPermissions))
      this.props.setPermissions(this.state.showEditForm, permissions)
    }
    this.setState({
      showEditForm: null,
      pickedPermissions: []
    })
    
  }

  pickPermission = (group) => (permissions) => {
    this.setState((state) => ({
      pickedPermissions: {
        ...state.pickedPermissions,
        [group]: permissions,
      }
    }))
  }

  render() {
    const {groups, removeGroup, intl, permissions} = this.props
    const groupedPermissions = groupby(permissions, 'group')
    
    const options = Object.keys(groupedPermissions)
      .reduce(
        (total, key) => ({
          ...total,
          [key.toLocaleLowerCase()]: groupedPermissions[key]
            .map((group) => ({
              label: group.name, value: group.id
            })),
        }),
        {}
      )

    return (
      <div className={s.tableBody}>
        <Row className={s.tableRow}>
          <Col className={s.tableCol} md={14}>
            {intl.formatMessage(messages.groupName)}
          </Col>
          <Col className={s.tableCol} md={10}>
            {intl.formatMessage(messages.permissionColumn)}
          </Col>
        </Row>
        <React.Fragment>
          {groups.map((group) =>
            <div key={group.id}>
              <Row className={s.tableRow}>
                <Col className={s.tableCol} md={12}>
                  <span className={s.rowName}>{group.name}</span>
                </Col>
                <Col className={s.tableCol} md={12}>
                  <div className={s.tableItemWrapper}>
                    {
                      group.editable ?
                      (this.state.showEditForm === group.id) ?
                        <a className={s.tableBtn} onClick={()=>this.submitGroup(group)}>
                          <PlusIcon/>
                          <span>{intl.formatMessage(messages.savePermissions)}</span>
                        </a> :
                        <a className={s.tableBtn} onClick={() => this.editGroup(group.id)}>
                          <EditIcon/>
                          <span>{intl.formatMessage(messages.editPermissions)}</span>
                        </a>
                      :
                      (this.state.showEditForm === group.id) ?
                        <a className={s.tableBtn} onClick={()=>this.submitGroup(group)}>
                          <span>{'View Details'}</span>
                        </a> :
                        <a className={s.tableBtn} onClick={() => this.editGroup(group.id)}>
                          <span>{'View Details'}</span>
                        </a>
                    }
                    {
                      group.editable ?
                      <a className={s.tableBtn} onClick={() => removeGroup(group.id)}>
                        <RemoveIcon/>
                        <span>{intl.formatMessage(messages.deleteGroup)}</span>
                      </a> :
                      <div style={{width:'115px'}}/>
                    }
                  </div>
                </Col>
              </Row>
              {this.state.showEditForm === group.id &&
              <Row className={s.permissionRow}>
                <Col md={4}>
                  <h1>{intl.formatMessage(messages.contacts)}</h1>
                  <CheckboxGroup disabled={!group.editable} value = {this.state.pickedPermissions['contacts']} onChange={this.pickPermission('contacts')} className={s.checkBox} options={options.contacts}/>
                </Col>
                <Col md={4}>
                  <h1>{intl.formatMessage(messages.groups)}</h1>
                  <CheckboxGroup disabled={!group.editable} value = {this.state.pickedPermissions['groups']} onChange={this.pickPermission('groups')} options={options.groups}/>
                </Col>
                <Col md={5}>
                  <h1>{intl.formatMessage(messages.team)}</h1>
                  <CheckboxGroup disabled={!group.editable} value = {this.state.pickedPermissions['team']} onChange={this.pickPermission('team')} options={options.team}/>
                </Col>
                <Col md={4}>
                  <h1>{intl.formatMessage(messages.purchase)}</h1>
                  <CheckboxGroup disabled={!group.editable} value = {this.state.pickedPermissions['purchase']} onChange={this.pickPermission('purchase')} options={options.purchase}/>
                </Col>
                <Col md={4}>
                  <h1>{intl.formatMessage(messages.payments)}</h1>
                  <CheckboxGroup disabled={!group.editable} value = {this.state.pickedPermissions['payments']} onChange={this.pickPermission('payments')} options={options.payments}/>
                </Col>
              </Row>}
            </div>
          )}
        </React.Fragment>
      </div>
    )
  }
}
const mapState = state => ({
  selectedPermissions: state.permission.specialPermissions,
})

const mapDispatch = {
  getPermissionsOfSpecialRole,
}
export default connect(mapState, mapDispatch)(withStyles(s)(PermissionsTable))
