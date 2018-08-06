import React from 'react'
import {clear} from '../../reducers/contacts'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactUs.css'
import {Form, Row, Col, Input, Button} from 'antd'
import PlusIcon from '../../static/plus.svg'
import messages from './messages'
import {sendEnquiries} from '../../reducers/contactUs'
const {TextArea} = Input;

class ContactUs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      attachments: [],
    }
  }

  handleChangeInput = (name, e) => {
    this.setState({[name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.sendEnquiries(this.state)
    Object.keys(this.state).map((k) => {
      if(k!=='attachment') {
        this.setState({[k]: ''})
      } else {
        this.setState({attachments: []})
      }
    })
  }

  addAttachment = (e) => {
    const files = e.target.files
    if (this.state.attachments.length < 5) {
      this.setState({
        attachments: [...this.state.attachments, files[files.length-1]]
      })
    }
  }

  render() {
    const {intl} = this.props
    return (
      <div className={s.wrapper}>
        <div className={s.container}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
          <div className={s.subtitle}>
            Thank you for your interest in "by Zumi".<br/>
            Use the form below to send your comment or questions.
          </div>
          <Form onSubmit={this.handleSubmit} className={s.formContainer}>
            <Row gutter={40} type='flex'>
              <Col md={12}>
                <Input
                  className={s.contactInput}
                  value={this.state.name}
                  placeholder={intl.formatMessage(messages.nameInput)}
                  onChange={(e) => this.handleChangeInput('name', e)}
                  required
                />
                <Input
                  className={s.contactInput}
                  value={this.state.email}
                  placeholder={intl.formatMessage(messages.emailInput)}
                  onChange={(e) => this.handleChangeInput('email', e)}
                  type='email'
                  required
                />
              </Col>
              <Col md={12}>
                <Input
                  className={s.contactInput}
                  value={this.state.phone}
                  placeholder={intl.formatMessage(messages.phoneInput)}
                  onChange={(e) => this.handleChangeInput('phone', e)}
                  type='tel'
                />
                <Input
                  className={s.contactInput}
                  value={this.state.subject}
                  placeholder={intl.formatMessage(messages.subjectInput)}
                  onChange={(e) => this.handleChangeInput('subject', e)}
                />
              </Col>
            </Row>
            <Row gutter={40} type='flex'>
              <Col md={24}>
                <span className={s.messageTitle}>{intl.formatMessage(messages.messageInput)}</span>
                <TextArea
                  className={s.textArea}
                  value={this.state.message}
                  autosize={{ minRows: 6, maxRows: 10 }}
                  onChange={(e) => this.handleChangeInput('message', e)}
                  required
                />
                <label className={s.attachBtn}>
                  <input type='file' onChange={this.addAttachment}/>
                  <PlusIcon/>
                  {intl.formatMessage(messages.attachmentButton)}
                </label>
                <ul>
                  {this.state.attachments &&
                    this.state.attachments.map((attach, index) => <li key={index}>{attach.name}</li>)}
                </ul>
              </Col>
            </Row>
            <Row className={s.submitRow}>
              <Button className={s.submitBtn} htmlType='submit' type='primary'>
                {intl.formatMessage(messages.submit)}
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  // ...state.contacts,
})

const mapDispatch = {
  sendEnquiries,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ContactUs))
