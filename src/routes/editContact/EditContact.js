import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, Row, Modal, Popconfirm, message } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './EditContact.css'
import PlusIcon from '../../static/plus.svg'
import RemoveIcon from '../../static/remove.svg'
import { editContact, clear, removeContact, setChangingStatusEditForm, setupBirthday } from '../../reducers/contacts'
import { ContactForm } from '../../components'
import messages from './messages'
import { setNextRouteName, navigateToNextRouteName } from '../../reducers/global';
import moment from 'moment'
import { isUndefined, isNull } from 'lodash';

class EditContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      nextPathname: null,
      isChanged: false,
      requirAddress: false
    }
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
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
  onOk() {
    this.setState({ visible: false });
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.editContact(values, this.props.form, this.state.nextPathname)
      }
    })
  }
  onCancel(e) {
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
          (isUndefined(reminder.date)||reminder.date === '') &&
          isUndefined(reminder.occasion_id) &&
          isUndefined(reminder.recurring) &&
          (isNull(reminder.reminder_date) ||
          isUndefined(reminder.reminder_date))
        ) {
          
        }
        else{
          if (
            (isUndefined(reminder.date)||reminder.date === '') ||
            isUndefined(reminder.occasion_id) ||
            isUndefined(reminder.recurring) ||
            isNull(reminder.reminder_date) ||
            isUndefined(reminder.reminder_date)
          ) {
            reminderError = true;
          }
        }
      });
      if (reminderError) {
        message.error(this.props.intl.formatMessage(messages.reminderError));
        return false;
      }
      if (!err && this.props.form.getFieldsError().dob == null) {
        var addresses = this.props.form.getFieldValue('addresses')
          if (addresses === null) {
            this.props.editContact(values, this.props.form)
            return true;
          } else {
            var validate = false;
            addresses.map(item => {
              if (item.address != undefined && item.address != null && item.address !== '')
                validate = true;
            });
            if (validate) {
              this.props.editContact(values, this.props.form)
              return true;
            }
            this.setState({ requirAddress: true });
            return false;
          }
      }
      return false;
    })
  }
  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    const { intl, contact, removeContact, setupBirthday } = this.props
    
    return contact ? (
      <div>
        <Modal
          title={intl.formatMessage(messages.confirm)}
          visible={this.state.visible}
          onOk={this.onOk}
          onCancel={this.onCancel}
          okText={intl.formatMessage(messages.yes)}
          cancelText={intl.formatMessage(messages.no)}
        >
          <h2>{intl.formatMessage(messages.saveConfirm)}</h2>
        </Modal>
        <ContactForm initialValues={contact} form={this.props.form} header={intl.formatMessage(messages.header)} setupBirthday={setupBirthday}>
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
                    <Popconfirm
                      title={intl.formatMessage(messages.confirmRemoving)}
                      onConfirm={() => {
                        if(contact.is_connected_to_order)
                          message.warn(intl.formatMessage(messages.warningRemoving));
                        else removeContact(contact)
                      }}
                      okText={intl.formatMessage(messages.acceptRemoving)}
                    >
                      <Button type='danger' type='primary' ghost style={{ float: 'right' }}>
                        <RemoveIcon />
                        {intl.formatMessage(messages.delete)}
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </Form>
            )}
        </ContactForm>
      </div>
    ) : null
  }
}

const mapState = state => ({
  loading: state.contacts.loading,
  contact: state.contacts.contact,
  global: state.global,
  changedForm: state.contacts.changedForm
})

const mapDispatch = {
  editContact,
  clear,
  setNextRouteName,
  navigateToNextRouteName,
  removeContact,
  setChangingStatusEditForm,
  setupBirthday
}

export default connect(mapState, mapDispatch)(Form.create({
  onValuesChange(props, fields, values) {
    props.setChangingStatusEditForm(true);
  },
})(withStyles(s)(EditContact)))
