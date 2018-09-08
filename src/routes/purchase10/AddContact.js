import React from 'react'
import {connect} from 'react-redux'
import {Button, Form} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddContact.css'
import {ContactForm, PurchaseActions, SectionHeader} from '../../components'
import {nextFlowStep} from '../../reducers/purchase'
import {addContact, editContact,saveFields,getContact,setContact } from '../../reducers/contacts'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import isEmpty from 'lodash/isEmpty'

class AddContact extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      contact: null
    }
    if(props.selectedContact && props.selectedContact.id)
      props.getContact(props.selectedContact.id);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps && nextProps.contact && this.props.selectedContact && this.props.selectedContact.id)
      this.setState({contact: nextProps.contact});
  }
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
        if(this.props.selectedContact && this.props.selectedContact.id)
        {
          this.props.editContact(values, this.props.form,null, () => this.props.nextFlowStep())
        }
        else this.props.addContact(values, this.props.form, () => this.props.nextFlowStep())
        return true;
      }
      return false;
    })
    return false;
  }

  render() {
    const {flowIndex, intl} = this.props
    
    return (
      <ContactForm initialValues = {this.state.contact} form={this.props.form} header={null} initRequiredAddress={1}>
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
          </Form>
        )}
      </ContactForm>
    )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
  fields: state.contacts.fields,
  contact: state.contacts.contact
})

const mapDispatch = {
  addContact,
  nextFlowStep,
  saveFields,
  editContact,
  getContact,
  setContact
}

export default connect(mapState, mapDispatch)(Form.create({
  onValuesChange(props, fields, values) {
    props.saveFields(values, fields)
  },
})(withStyles(s)(AddContact)))
