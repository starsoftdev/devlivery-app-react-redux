import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, Row, Modal, message } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddContact.css'
import PlusIcon from '../../static/plus.svg'
import { addContact, clear, setChangingStatusEditForm, setupBirthday } from '../../reducers/contacts'
import { ContactForm } from '../../components'
import messages from './messages'
import history from '../../history'
import { generateUrl } from '../../router'
import { setNextRouteName, navigateToNextRouteName } from '../../reducers/global';
import { CONTACTS_ROUTE } from '../'
import moment from 'moment'
import { isNull, isUndefined } from 'lodash';

class AddContact extends React.Component {
  state = {
    visible: false,
    nextPathname: null,
    isChanged: false,
    requirAddress: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.global && nextProps.global.nextPathname && !this.state.visible) {
      if (nextProps.changedForm) {
        this.setState({ visible: true, nextPathname: nextProps.global.nextPathname });
        this.props.setNextRouteName(null);
      }
      else {
        this.props.setNextRouteName(null);
        this.props.navigateToNextRouteName(nextProps.global.nextPathname);
      }
    }
  }

  componentWillUnmount() {
    this.props.clear()
  }

  onOk = () => {
    this.setState({ visible: false });
  }

  onCancel = (e) => {
    this.setState({ visible: false });
    if(e.target.value !== undefined)
      this.props.navigateToNextRouteName(this.state.nextPathname);
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields({ force: true }, (err, values) => {
      let reminderError = false;
      values.reminders && values.reminders.map(reminder => {
        if (
          isUndefined(reminder.date) ||
          isUndefined(reminder.occasion_id) ||
          isUndefined(reminder.recurring) ||
          isNull(reminder.reminder_date) ||
          isUndefined(reminder.reminder_date)
        ) {
          reminderError = true;
        }
      });
      if (reminderError) {
        message.error(this.props.intl.formatMessage(messages.reminderError));
        return false;
      }
      if (!reminderError && !err && this.props.form.getFieldsError().dob == null) {
        var addresses = this.props.form.getFieldValue('addresses')
          if (addresses === null) {
            this.props.addContact(values, this.props.form, () => history.push(generateUrl(CONTACTS_ROUTE)))
            return true;
          } else {
            var validate = false;
            addresses.map(item => {
              if (item.address != undefined && item.address != null && item.address !== '')
                validate = true;
            });
            if (validate) {
              this.props.addContact(values, this.props.form, () => history.push(generateUrl(CONTACTS_ROUTE)))
              return true;
            }
            this.setState({ requirAddress: true });
            return false;
          }
      }
      return false;
    })
  }

  render() {
    const { intl, contact, setupBirthday } = this.props
    return (
      <React.Fragment>
        <Modal
          title="Confirm"
          visible={this.state.visible}
          onOk={this.onOk}
          onCancel={this.onCancel}
          okText="Yes"
          cancelText="No"
        >
          <h2>Do you wish save the information you've edited?</h2>
        </Modal>
        <ContactForm form={this.props.form} header={intl.formatMessage(messages.header)} setupBirthday={setupBirthday}>
          {({
            contactSection,
            birthdaySection,
            homeAddressSection,
            companyAddressSection,
            remindersSection,
            groupsSection,
          }) => (
              <Form onSubmit={this.handleSubmit} className={s.container}>
                <div className={s.content}>
                  <Row type='flex' gutter={20}>
                    <Col xs={24} md={12} className={s.leftColumn}>
                      {contactSection}
                      {birthdaySection}
                      {
                        <h4 className={this.state.requirAddress ? s.requirAddress : s.norequirAddress}>{intl.formatMessage(messages.requireadres)}</h4>
                      }
                      {homeAddressSection}
                      {companyAddressSection}
                    </Col>
                    <Col xs={24} md={12} className={s.rightColumn}>
                      {remindersSection}
                      {groupsSection}
                    </Col>
                  </Row>
                </div>
                <div className={s.actionsWrapper}>
                  <div className={s.actions}>
                    <Button htmlType='submit' type='primary' ghost>
                      <PlusIcon />
                      {intl.formatMessage(messages.submit)}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
        </ContactForm>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  loading: state.contacts.loading,
  contact: state.contacts.contact,
  global: state.global,
  changedForm: state.contacts.changedForm
})

const mapDispatch = {
  addContact,
  setupBirthday,
  clear,
  setNextRouteName,
  navigateToNextRouteName,
  setChangingStatusEditForm,
}

export default connect(mapState, mapDispatch)(Form.create({
  onValuesChange(props, fields, values) {
    props.setChangingStatusEditForm(true);
  },
})(withStyles(s)(AddContact)))
