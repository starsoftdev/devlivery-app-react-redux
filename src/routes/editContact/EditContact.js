import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './EditContact.css'
import PlusIcon from '../../static/plus.svg'
import {editContact, clear} from '../../reducers/contacts'
import {ContactForm} from '../../components'
import messages from './messages'

class EditContact extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields({force: true}, (err, values) => {
      if (!err) {
        this.props.editContact(values, this.props.form)
      }
    })
  }

  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    const {intl, contact} = this.props
    return contact ? (
      <ContactForm initialValues={contact} form={this.props.form} header={intl.formatMessage(messages.header)}>
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
                  <PlusIcon/>
                  {intl.formatMessage(messages.submit)}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </ContactForm>
    ) : null
  }
}

const mapState = state => ({
  loading: state.contacts.loading,
  contact: state.contacts.contact,
})

const mapDispatch = {
  editContact,
  clear,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(EditContact)))
