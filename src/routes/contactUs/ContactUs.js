import React from 'react'
import {clear} from '../../reducers/contacts'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactUs.css'
import {Form, Row, Col, Input, Button} from 'antd'
import PlusIcon from '../../static/plus.svg'
import messages from './messages'
import {sendEnquiries} from '../../reducers/contactUs'
import {FloatingLabel} from '../../components';
import contactusImage from '../../static/POSE_7.png'

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
      email_err: null
    }
  }

  handleChangeInput = (name, e) => {
    this.setState({[name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({email_err:null});
    this.props.sendEnquiries(this.state, (errors) =>{
      if(errors){
        console.log("errors",errors);
        if(errors.hasOwnProperty('email') && errors.email.errors && errors.email.errors[0].message)
        {
          this.setState({email_err:errors.email.errors[0].message});
        }
      }
      else{
        Object.keys(this.state).map((k) => {
          if(k!=='attachment') {
            this.setState({[k]: ''})
          } else {
            this.setState({attachments: []})
          }
        })
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
          <section className={intl.locale === "de-DE" ? s.contentContainer_de : s.contentContainer}>
            <Row type='flex' >
              <Col sm={24} md={intl.locale === "de-DE" ? 16 : 12} className={s.titleContainer}>
                {/*<h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>*/}
                {
                  intl.locale === "de-DE" &&
                  <div className={s.subtitle}>
                    Kundenverblüffung leicht gemacht<br/>
                    Wir unterstützen Sie von A bis Z bei der Betreuung Ihrer Kunden und Partner: Wir bedrucken, verpacken, frankieren und versenden Karten zu unterschiedlichsten Ereignissen auf Bestellung. Auf Wunsch organisieren wir auch ein passendes Geschenk dazu – zum Beispiel einen Gutschein oder einen Wein. Besonders praktisch: Sobald Ihre Kontakte einmal erfasst sind, kümmern wir uns automatisch um Anlässe wie Geburtstage. Dabei informieren wir Sie jeweils über bevorstehende Ereignisse Ihrer Kontakte. Sie entscheiden dann, was in der jeweiligen Situation angebracht ist.<br/><br/>
                    Kurz: Zumi ist Ihr virtuelle Assistentin, die stets voraus denkt und Ihnen in allen Aspekten der Kundenpflege zur Seite steht.
                  </div>
                }
                {
                  intl.locale !== "de-DE" &&
                  <div className={s.subtitle}>
                    Thank you for your interest in "by Zumi".<br/>
                    Use the form below to send your comment or questions.
                  </div>
                }
              </Col>
              <Col sm={24} md={intl.locale === "de-DE" ? 8 : 12} className={s.titleContainer}>
                <div style={{backgroundImage: `url(${contactusImage})`}} className={s.cardImage}/>
              </Col>
            </Row>
          </section>
          <Form onSubmit={this.handleSubmit} className={s.formContainer}>
            <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
            <Row gutter={40} type='flex'>
              <Col md={12} className={s.contactInput}>
                <FloatingLabel
                  value={this.state.name}
                  placeholder={intl.formatMessage(messages.nameInput)}
                  onChange={(e) => this.handleChangeInput('name', e)}
                  required
                />
                <FloatingLabel
                  value={this.state.email}
                  placeholder={intl.formatMessage(messages.emailInput)}
                  onChange={(e) => this.handleChangeInput('email', e)}
                  type='email'
                  required
                />
                {
                  this.state.email_err &&
                  <h5 className={s.error}>{this.state.email_err}</h5>
                }
              </Col>
              <Col md={12} className={s.contactInput}>
                <FloatingLabel
                  value={this.state.phone}
                  placeholder={intl.formatMessage(messages.phoneInput)}
                  onChange={(e) => this.handleChangeInput('phone', e)}
                  type='tel'
                />
                <FloatingLabel
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
                  <Input type='file' onChange={this.addAttachment}/>
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
