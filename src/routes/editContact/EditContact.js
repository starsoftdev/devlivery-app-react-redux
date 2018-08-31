import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Row, Modal} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './EditContact.css'
import PlusIcon from '../../static/plus.svg'
import {editContact, clear} from '../../reducers/contacts'
import {ContactForm} from '../../components'
import messages from './messages'
import { setNextRouteName,navigateToNextRouteName } from '../../reducers/global';

class EditContact extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      nextPathname: null
    }
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.global && nextProps.global.nextPathname && !this.state.visible)
    {
      this.setState({visible:true, nextPathname:nextProps.global.nextPathname});
      this.props.setNextRouteName(null);
    }
  }
  onOk(){
    this.setState({visible:false});
    this.props.form.validateFields({force: true}, (err, values) => {
      if (!err) {
        this.props.editContact(values, this.props.form,this.state.nextPathname)
      }
    })
  }
  onCancel(){
    this.setState({visible:false});
    this.props.navigateToNextRouteName(this.state.nextPathname);
  }
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
      <div>
        <Modal
          title="Confirm"
          visible={this.state.visible}
          onOk={this.onOk}
          onCancel={this.onCancel}
          okText="Yes"
          cancelText="No"
        >
          <h2>Do you wanna save the information you've edited?</h2>
        </Modal>
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
      </div>
    ) : null
  }
}

const mapState = state => ({
  loading: state.contacts.loading,
  contact: state.contacts.contact,
  global: state.global
})

const mapDispatch = {
  editContact,
  clear,
  setNextRouteName,
  navigateToNextRouteName
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(EditContact)))
