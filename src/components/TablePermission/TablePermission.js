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

const CheckboxGroup = Checkbox.Group;

class PermissionsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showEditForm: null,
      pickedPermissions: {},
    }
  }

  editGroup = (id) => {
    this.setState({showEditForm: id})
  }

  submitGroup = () => {
    const permissions = _.flatten(Object.values(this.state.pickedPermissions))
    this.props.setPermissions(this.state.showEditForm, permissions)
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
                      (this.state.showEditForm === group.id) ?
                        <a className={s.tableBtn} onClick={this.submitGroup}>
                          <PlusIcon/>
                          <span>{intl.formatMessage(messages.savePermissions)}</span>
                        </a> :
                        <a className={s.tableBtn} onClick={() => this.editGroup(group.id)}>
                          <EditIcon/>
                          <span>{intl.formatMessage(messages.editPermissions)}</span>
                        </a>
                    }
                    <a className={s.tableBtn} onClick={() => removeGroup(group.id)}>
                      <RemoveIcon/>
                      <span>{intl.formatMessage(messages.deleteGroup)}</span>
                    </a>
                  </div>
                </Col>
              </Row>
              {this.state.showEditForm === group.id &&
              <Row className={s.permissionRow}>
                <Col md={4}>
                  <h1>Contacts</h1>
                  <CheckboxGroup onChange={this.pickPermission('contacts')} className={s.checkBox} options={options.contacts}/>
                </Col>
                <Col md={4}>
                  <h1>Groups</h1>
                  <CheckboxGroup onChange={this.pickPermission('groups')} options={options.groups}/>
                </Col>
                <Col md={5}>
                  <h1>Team</h1>
                  <CheckboxGroup onChange={this.pickPermission('team')} options={options.team}/>
                </Col>
                <Col md={4}>
                  <h1>Purchase</h1>
                  <CheckboxGroup onChange={this.pickPermission('purchase')} options={options.purchase}/>
                </Col>
                <Col md={4}>
                  <h1>Payments</h1>
                  <CheckboxGroup onChange={this.pickPermission('payments')} options={options.payments}/>
                </Col>
              </Row>}
            </div>
          )}
        </React.Fragment>
      </div>
    )
  }
}

export default withStyles(s)(PermissionsTable)