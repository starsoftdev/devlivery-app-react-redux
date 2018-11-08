import React from 'react'
import {connect} from 'react-redux'
import {Button, Form} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddContact.css'
import {ContactForm, PurchaseActions, SectionHeader} from '../../components'
import {nextFlowStep,GROUP_ID_KEY,CONTACT_IDS_KEY,gotoConfirm,setNewRecipients} from '../../reducers/purchase'
import {addContact, editContact,saveFields,setContact,setupBirthday } from '../../reducers/contacts'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'

class AddContact extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      contact: null,
      requirAddress:false
    }
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
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err && this.props.form.getFieldsError().dob == null) {
        var addresses = this.props.form.getFieldValue('addresses')
          if(addresses === null)
          {
            this.onNextSubmit(values);
            return true;
          }else{
            var validate = false;
            addresses.map(item =>{
              if(item.address != undefined && item.address != null && item.address !== '')
                validate = true;
            });
            if(validate)
            {
              this.onNextSubmit(values);
              return true;
            }
            this.setState({requirAddress:true});
            return false;
          }
      }
      return false;
    })
    return false;
  }
  onNextSubmit(values){
    this.props.addContact(values, this.props.form, (contact) => {
      localStorage.removeItem(GROUP_ID_KEY)
      this.props.setNewRecipients([contact.id]);
      if(this.props.recipientMode)
        this.props.gotoConfirm();
      else this.props.nextFlowStep()
    })
  }
  render() {
    const {flowIndex, intl,setupBirthday } = this.props
    
    return (
      <ContactForm initialValues = {this.state.contact} form={this.props.form} header={null} initRequiredAddress={-1} setupBirthday = {setupBirthday}>
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
              {
                <h4 className={this.state.requirAddress ? s.requirAddress: s.norequirAddress}>{intl.formatMessage(messages.requireadres)}</h4>
              }
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
  recipientMode: state.purchase.recipientMode,
  flowIndex: state.purchase.flowIndex,
  fields: state.contacts.fields,
  contact: state.contacts.contact
})

const mapDispatch = {
  addContact,
  nextFlowStep,
  saveFields,
  editContact,
  setContact,
  gotoConfirm,
  setNewRecipients,
  setupBirthday
}

export default connect(mapState, mapDispatch)(Form.create({
  onValuesChange(props, fields, values) {
    props.saveFields(values, fields)
  },
})(withStyles(s)(AddContact)))
