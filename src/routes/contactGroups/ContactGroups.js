import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Pagination, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactGroups.css'
import EditIcon from '../../static/edit.svg'
import RemoveIcon from '../../static/remove.svg'
import PlusIcon from '../../static/plus.svg'
import {clear, getContactGroups, removeContactGroup} from '../../reducers/contactGroups'
import {Link, PaginationItem} from '../../components'
import messages from './messages'
import {ADD_CONTACT_GROUP_ROUTE, EDIT_CONTACT_GROUP_ROUTE} from '../'

class ContactGroups extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    // TODO add loading
    const {
      contactGroups,
      contactGroupsCount,
      removeContactGroup,
      page,
      pageSize,
      loading,
      getContactGroups,
      intl,
    } = this.props

    return (
      <div className={s.container}>
        <Row type='flex' gutter={20}>
          <Col xs={24} sm={16}>
            <Row type='flex' gutter={20}>
              {contactGroups.map((group) =>
                <Col key={group.id} xs={24} sm={12}>
                  <div className={s.group}>
                    <Link className={s.editBtn}
                          to={{name: EDIT_CONTACT_GROUP_ROUTE, params: {groupId: group.id, title: group.title}}}>
                      <EditIcon/>
                    </Link>
                    <a className={s.removeBtn} onClick={() => removeContactGroup(group)}>
                      <RemoveIcon/>
                    </a>
                    <p className={s.groupName}>{group.title}</p>
                  </div>
                </Col>
              )}
            </Row>
            <div className={s.footer}>
              <Pagination
                current={page}
                total={contactGroupsCount}
                showTotal={(total, range) => intl.formatMessage(messages.tableItems, {
                  range0: range[0],
                  range1: range[1],
                  total
                })}
                pageSize={pageSize}
                showSizeChanger
                onChange={(page, pageSize) => getContactGroups({page, pageSize})}
                onShowSizeChange={(page, pageSize) => getContactGroups({page, pageSize})}
                itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <Link to={ADD_CONTACT_GROUP_ROUTE}>
              <Button type='primary' ghost>
                <PlusIcon className={s.addIcon}/>
                {intl.formatMessage(messages.addGroup)}
              </Button>
            </Link>
            <p className={s.description}>
              {intl.formatMessage(messages.description)}
            </p>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapState = state => ({
  ...state.contactGroups,
})

const mapDispatch = {
  removeContactGroup,
  getContactGroups,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ContactGroups))
