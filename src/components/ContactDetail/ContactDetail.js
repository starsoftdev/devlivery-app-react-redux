import React from 'react'
import {Modal, Row, Col} from 'antd'
import {getContact} from '../../reducers/contacts'
import {connect} from "react-redux";
import s from './ContactDetail.css'
import withStyles from "isomorphic-style-loader/lib/withStyles";
import {EDIT_CONTACT_ROUTE} from '../../routes'
import {Link} from '../';
import {defineMessages} from 'react-intl'

const trans_adr = {
  office:'Geschäfts',
  home:'Wohn'
}
const messages = defineMessages({
  editbutton: {
    id: 'editContact.breadcrumb',
    defaultMessage: 'Edit Contact',
  },
  email: {
    id: 'editContact.email',
    defaultMessage: 'Email',
  },
  phone: {
    id: 'editContact.phone',
    defaultMessage: 'Phone',
  },
  nickname: {
    id: 'editContact.nickname',
    defaultMessage: 'Nickname',
  },
  relationship: {
    id: 'editContact.relationship',
    defaultMessage: 'Relationship',
  },
  home: {
    id: 'editContact.home',
    defaultMessage: 'Home',
  },
})


class ContactDetail extends React.Component {
  componentDidMount() {
    this.props.getContact(this.props.contactId)
  }

  render() {
    const {intl,last_name, first_name, email, phone, nickname, relationship, addresses,contactId} = this.props
    
    return (
      <Modal
        className={s.contactDetailModal}
        title={(<p className={s.headertitle} title={first_name+'\n'+last_name}>{first_name} {last_name}</p>)}
        visible
        onCancel={this.props.closeDetailContactView}
        footer={null}
      >
        <Row className={s.detailRow}>
          <Col md={12}>
            <span className={s.contactDetailTitle}>{intl.formatMessage(messages.email)}</span><br/>
            <span className={s.contactDetail}>{email}</span>
          </Col>
          <Col md={12}>
            <span className={s.contactDetailTitle}>{intl.formatMessage(messages.phone)}</span><br/>
            <span className={s.contactDetail}>{phone}</span>
          </Col>
        </Row>
        <Row className={s.detailRow}>
          <Col md={12}>
            <span className={s.contactDetailTitle}>{intl.formatMessage(messages.nickname)}</span><br/>
            <span className={s.contactDetail}>{nickname}</span>
          </Col>
          <Col md={12}>
            <span className={s.contactDetailTitle}>{intl.formatMessage(messages.relationship)}</span><br/>
            <span className={s.contactDetail}>{relationship}</span>
          </Col>
        </Row>
        <Row className={s.detailRow}>
          <span className={s.contactDetailTitle}>{intl.formatMessage(messages.home)}</span><br/>
          {addresses && addresses.map((address) =>
            <Col key={address.id} md={12}>
              <span className={s.contactDetail}>
                {intl.locale == 'de-DE' ? trans_adr[address.title] : address.title}
              </span>
              <br/>
              <span className={s.contactDetail}>
                {address.address2 ? `${address.address} ${address.address2}` : address.address.join('\n')}
              </span>
              <br/>
              <span className={s.contactDetail}>{address.postal_code} {address.city}</span><br/>
              <span className={s.contactDetail}>{address.country}</span><br/>
              <span className={s.contactDetail}></span>
            </Col>
          )}
        </Row>
        <Row>
          <Link to={{name: EDIT_CONTACT_ROUTE, params: {contactId}}} >
            <div className={s.editbutton}>
            {intl.formatMessage(messages.editbutton)}
            </div>
          </Link>
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
