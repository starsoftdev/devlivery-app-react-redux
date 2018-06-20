import React from 'react'
import {connect} from 'react-redux'
import {Col, Input, Pagination, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactGroups.css'
import EditIcon from '../../static/edit.svg'
import RemoveIcon from '../../static/remove.svg'
import PlusIcon from '../../static/plus.svg'
import {
  addContactGroup,
  changeNewContactGroup,
  clear,
  getContactGroups,
  removeContactGroup
} from '../../reducers/contactGroups'
import {PaginationItem} from '../../components'

// TODO add pagination
class ContactGroups extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    // TODO add loading
    const {
      contactGroups,
      contactGroupsCount,
      addContactGroup,
      removeContactGroup,
      newContactGroup,
      changeNewContactGroup,
      page,
      pageSize,
      loading,
      getContactGroups,
    } = this.props

    return (
      <div className={s.container}>
        <Row type='flex' gutter={20}>
          <Col xs={24} sm={16}>
            <div className={s.newGroupNameWrapper}>
              <Input
                className={s.newGroupName}
                placeholder={'Group Name'}
                value={newContactGroup}
                onChange={(e) => changeNewContactGroup(e.target.value)}
              />
              <a className={s.addBtn} onClick={addContactGroup}>
                <PlusIcon className={s.addIcon}/>
                Add Group
              </a>
            </div>
            <Row type='flex' gutter={20}>
              {contactGroups.map((group) =>
                <Col key={group.id} xs={24} sm={12}>
                  <div className={s.group}>
                    <a className={s.editBtn}>
                      <EditIcon/>
                    </a>
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
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                pageSize={pageSize}
                showSizeChanger
                onChange={(page, pageSize) => getContactGroups({page, pageSize})}
                onShowSizeChange={(page, pageSize) => getContactGroups({page, pageSize})}
                itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <p className={s.description}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, electronic typesetting, remaining essentially
              unchanged
              remaining.
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
  addContactGroup,
  removeContactGroup,
  changeNewContactGroup,
  getContactGroups,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ContactGroups))
