import React from 'react'
import {Modal, Row, Col} from 'antd'
import {getContact} from '../../reducers/contacts'
import {connect} from "react-redux";
import s from './ContactDetail.css'
import withStyles from "isomorphic-style-loader/lib/withStyles";

class ContactDetail extends React.Component {
  componentDidMount() {
    this.props.getContact(this.props.contactId)
  }

  render() {
    const {last_name, first_name, email, phone, nickname, relationship, addresses} = this.props
    return (
      <Modal
        className={s.contactDetailModal}
        title={`${first_name} ${last_name}`}
        visible
        onCancel={this.props.closeDetailContactView}
        footer={null}
      >
        <Row className={s.detailRow}>
          <Col md={12}>
            <span className={s.contactDetailTitle}>Email</span><br/>
            <span className={s.contactDetail}>{email}</span>
          </Col>
          <Col md={12}>
            <span className={s.contactDetailTitle}>Phone</span><br/>
            <span className={s.contactDetail}>{phone}</span>
          </Col>
        </Row>
        <Row className={s.detailRow}>
          <Col md={12}>
            <span className={s.contactDetailTitle}>Nickname</span><br/>
            <span className={s.contactDetail}>{nickname}</span>
          </Col>
          <Col md={12}>
            <span className={s.contactDetailTitle}>Relationship</span><br/>
            <span className={s.contactDetail}>{relationship}</span>
          </Col>
        </Row>
        <Row className={s.detailRow}>
          {addresses && addresses.map((address) =>
            <Col key={address.id} md={12}>
              <span className={s.contactDetailTitle}>{address.title}</span><br/>
              <span className={s.contactDetail}>
                {address.address2 ? `${address.address} ${address.address2}` : address.address}
              </span>
              <br/>
              <span className={s.contactDetail}>{address.city}</span><br/>
              <span className={s.contactDetail}>{address.country}</span><br/>
            </Col>
          )}
        </Row>
      </Modal>
    )
  }
}

const mapState = state => ({
  ...state.contacts.contact,
})

const mapDispatch = {
  getContact,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ContactDetail))
