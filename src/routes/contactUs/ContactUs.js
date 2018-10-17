import React from 'react'
import { clear } from '../../reducers/contacts'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactUs.css'
import { Form, Row, Col, Input, Button, message } from 'antd'
import PlusIcon from '../../static/plus.svg'
import messages from './messages'
import { sendEnquiries } from '../../reducers/contactUs'
import { FloatingLabel } from '../../components';
import contactusImage from '../../static/POSE_7.png'
import formMessages from '../../formMessages'

const { TextArea } = Input;

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
    this.setState({ [name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.sendEnquiries({...values,attachments:this.state.attachments}, (errors) => {
          if (errors) {
            console.log("errors", errors);
            if (errors.hasOwnProperty('email') && errors.email.errors && errors.email.errors[0].message) {
              message.warn( errors.email.errors[0].message);
            }
          }
          else {
            this.setState({ attachments: [] });
            this.props.form.setFieldsValue({
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: '',
            });
          }
        })
      }
    })
  }

  /*
   handleSubmit = (e) => {
     e.preventDefault()
     this.setState({ email_err: null });
     this.props.sendEnquiries(this.state, (errors) => {
       if (errors) {
         console.log("errors", errors);
         if (errors.hasOwnProperty('email') && errors.email.errors && errors.email.errors[0].message) {
           this.setState({ email_err: errors.email.errors[0].message });
         }
       }
       else {
         Object.keys(this.state).map((k) => {
           if (k !== 'attachment') {
             this.setState({ [k]: '' })
           } else {
             this.setState({ attachments: [] })
           }
         })
       }
     })
 
   }
 */
  addAttachment = (e) => {
    const files = e.target.files
    if (this.state.attachments.length < 5) {
      this.setState({
        attachments: [...this.state.attachments, files[files.length - 1]]
      })
    }
  }

  render() {
    const { intl } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div className={s.wrapper}>
        <div className={s.container}>
          <section className={intl.locale === "de-DE" ? s.contentContainer_de : s.contentContainer}>
            <Row type='flex' >
              <Col sm={24} md={intl.locale === "de-DE" ? 16 : 16} className={s.titleContainer}>
                {/*<h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>*/}
                {
                  intl.locale === "de-DE" &&
                  <p className={s.subtitle}>
                    Kundenverblüffung leicht gemacht.<br />
                    Wir unterstützen Sie von A bis Z bei der Betreuung Ihrer Kunden und Partner: Wir bedrucken, verpacken, frankieren und versenden Karten zu unterschiedlichsten Ereignissen auf Bestellung. Auf Wunsch organisieren wir auch ein passendes Geschenk dazu – zum Beispiel einen Gutschein oder einen Wein. Besonders praktisch: Sobald Ihre Kontakte einmal erfasst sind, kümmern wir uns automatisch um Anlässe wie Geburtstage. Dabei informieren wir Sie jeweils über bevorstehende Ereignisse Ihrer Kontakte. Sie entscheiden dann, was in der jeweiligen Situation angebracht ist.<br /><br />
                    Kurz: Zumi ist Ihr virtuelle Assistentin, die stets voraus denkt und Ihnen in allen Aspekten der Kundenpflege zur Seite steht.
                  </p>
                }
                {
                  intl.locale !== "de-DE" &&
                  <p className={s.subtitle}>
                    Thank you for your interest in "by Zumi".<br />
                    Use the form below to send your comment or questions.
                  </p>
                }
              </Col>
              <Col sm={24} md={intl.locale === "de-DE" ? 8 : 8} className={s.titleContainer}>
                <div style={{ backgroundImage: `url(${contactusImage})` }} className={s.cardImage} />
              </Col>
            </Row>
          </section>
          <Form onSubmit={this.handleSubmit} className={s.formContainer}>
            <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
            <Row gutter={40} type='flex'>
              <Col md={12} className={s.contactInput}>
                <div className={s.formItem}>
                  <Form.Item>
                    {getFieldDecorator('name', {
                      initialValue: undefined,
                      rules: [
                        { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                      ],
                    })(
                      <FloatingLabel placeholder={intl.formatMessage(messages.nameInput)} />
                    )}
                  </Form.Item>
                </div>
                <div className={s.formItem}>
                  <Form.Item>
                    {getFieldDecorator('email', {
                      validateTrigger: 'onBlur',//'onBlur'
                      initialValue: undefined,
                      rules: [
                        { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                        { type: 'email', message: intl.formatMessage(formMessages.emailInvalid) },
                      ],
                    })(
                      <FloatingLabel placeholder={intl.formatMessage(messages.emailInput)} />
                    )}
                  </Form.Item>
                </div>
              </Col>
              <Col md={12} className={s.contactInput}>
                <div className={s.formItem}>
                  <Form.Item>
                    {getFieldDecorator('phone', {
                      initialValue: undefined,
                    })(
                      <FloatingLabel placeholder={intl.formatMessage(messages.phoneInput)} />
                    )}
                  </Form.Item>
                </div>
                <div className={s.formItem}>
                  <Form.Item>
                    {getFieldDecorator('subject', {
                      initialValue: undefined,
                    })(
                      <FloatingLabel placeholder={intl.formatMessage(messages.subjectInput)} />
                    )}
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={40} type='flex'>
              <Col md={24}>
                <span className={s.messageTitle}>{intl.formatMessage(messages.messageInput)}</span>
                <Form.Item>
                  {getFieldDecorator(`message`, {
                    initialValue: undefined,
                    rules: [
                      { required: true, min: 5, message: intl.formatMessage(formMessages.minLength, { length: 5 }) },
                    ],
                  })(
                    <TextArea
                      className={s.textArea}
                      autosize={{ minRows: 6, maxRows: 10 }}
                    />
                  )}
                </Form.Item>
                <label className={s.attachBtn}>
                  <Input type='file' onChange={this.addAttachment} />
                  <PlusIcon />
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

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(ContactUs)))
