import React from 'react'
import {connect} from 'react-redux'
import {Button, Form} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddContact.css'
import {ContactForm, Actions, SectionHeader} from '../../components'
import {nextFlowStep} from '../../reducers/purchase'
import {addContact} from '../../reducers/contacts'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'

class AddContact extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addContact(values, this.props.form, () => this.props.nextFlowStep())
      }
    })
  }

  render() {
    const {flowIndex, intl} = this.props
    return (
      <ContactForm form={this.props.form} header={null}>
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
            <Actions>
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
            </Actions>
          </Form>
        )}
      </ContactForm>
    )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  addContact,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(AddContact)))
