import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddContact.css'
import PlusIcon from '../../static/plus.svg'
import {addContact} from '../../reducers/contacts'
import {ContactForm} from '../../components'
import messages from './messages'
import history from '../../history'
import {generateUrl} from '../../router'
import {CONTACTS_ROUTE} from '../'

class AddContact extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addContact(values, this.props.form, () => history.push(generateUrl(CONTACTS_ROUTE)))
      }
    })
  }

  render() {
    const {intl} = this.props
    return (
      <ContactForm form={this.props.form} header={intl.formatMessage(messages.header)}>
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
    )
  }
}

const mapState = state => ({})

const mapDispatch = {
  addContact,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(AddContact)))
