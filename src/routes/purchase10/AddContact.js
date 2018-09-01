import React from 'react'
import {connect} from 'react-redux'
import {Button, Form} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddContact.css'
import {ContactForm, PurchaseActions, SectionHeader} from '../../components'
import {nextFlowStep} from '../../reducers/purchase'
import {addContact, saveFields} from '../../reducers/contacts'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import isEmpty from 'lodash/isEmpty'

class AddContact extends React.Component {
  componentDidMount () {
    if (!isEmpty(this.props.fields)) {
      this.props.form.setFieldsValue(this.props.fields)
    }
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  handleSubmit = () => {
    //e.preventDefault()
    this.props.form.validateFields({force: true}, (err, values) => {
      if (!err) {
        this.props.addContact(values, this.props.form, () => this.props.nextFlowStep())
      }
    })
  }

  render() {
    const {flowIndex, intl, selectedContact} = this.props
    return (
      <ContactForm initialValues = {selectedContact} form={this.props.form} header={null}>
        {({
            contactSection,
            birthdaySection,
            homeAddressSection,
            companyAddressSection,
            remindersSection,
            groupsSection,
          }) => (
          <Form onSubmit={this.handleSubmit}>
            <div className={s.content}>
              <SectionHeader
                header={intl.formatMessage(messages.header)}
                number={flowIndex + 1}
                prefixClassName={s.headerPrefix}
              />
              {contactSection}
              {birthdaySection}
              {homeAddressSection}
              {companyAddressSection}
              {remindersSection}
              {groupsSection}
            </div>
            {/*
            <PurchaseActions>
              <KeyHandler
                keyEventName={KEYPRESS}
                keyCode={13}
                onKeyHandle={this.handleSubmit}
              />
              <Button
                htmlType='submit'
                type='primary'
              >
                {intl.formatMessage(messages.submit)}
              </Button>
            </PurchaseActions>
            */}
          </Form>
        )}
      </ContactForm>
    )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
  fields: state.contacts.fields,
})

const mapDispatch = {
  addContact,
  nextFlowStep,
  saveFields,
}

export default connect(mapState, mapDispatch)(Form.create({
  onValuesChange(props, fields, values) {
    props.saveFields(values, fields)
  },
})(withStyles(s)(AddContact)))
