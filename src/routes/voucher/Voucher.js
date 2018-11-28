import React from 'react'
import { connect } from 'react-redux'
import { submitVoucher } from '../../reducers/purchase'
import { Button, Form, Input, Select } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Voucher.css'
import { Actions, PurchaseActions, SectionHeader, FloatingLabel } from '../../components'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import messages from './messages'
import { VOUCHER_TEMPLATE } from '../../constants'
import { loadFont } from '../../utils'
import ContentEditable from 'react-contenteditable'
import formMessages from '../../formMessages'
import cn from 'classnames';

const { TextArea } = Input;

const leftMargin = 35 + 8
const rightMargin = 30 + 8

const voucherStyles = {
  header: {
    position: 'absolute',
    top: 50,
    fontFamily: 'Alex Brush',
    color: '#346170',
    fontSize: 50,
    textAlign: 'center',
    width: '100%',
  },
  background: {
    width: 400,
    height: 580,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  input: {
    color: '#404D5F',
    fontSize: '15px',
    fontFamily: 'Proxima Nova',
    outline: 'none'
  },
  label: {
    fontFamily: 'Abril Fatface',
    color: '#BAAFAD',
    textAlign: 'center',
    width: '100%',
    fontSize: 24,
  },
  receiverLabel: {
    position: 'absolute',
    top: 142,
  },
  receiver: {
    position: 'absolute',
    top: 187,
    left: leftMargin,
    right: rightMargin,
    lineHeight: '32px',
    maxHeight: '32px',
    overflow: 'hidden',
  },
  giverLabel: {
    position: 'absolute',
    top: 227,
  },
  giver: {
    position: 'absolute',
    top: 272,
    left: leftMargin,
    right: rightMargin,
    lineHeight: '32px',
    maxHeight: '32px',
    overflow: 'hidden',
  },
  bodyLabel: {
    position: 'absolute',
    top: 312,
  },
  body: {
    position: 'absolute',
    top: 356,
    left: leftMargin,
    right: rightMargin,
    lineHeight: '35px',
    maxHeight: '105px',
    overflow: 'hidden',
  }
}

// TODO add recipient/receiver fields as dropdowns
class Voucher extends React.Component {
  state = {
    template: undefined
  }
  componentDidMount() {
    loadFont('Abril Fatface')
    loadFont('Alex Brush')
    if(this.props.voucher && this.props.voucher.from && this.props.templates)
    {
      const selItem = this.props.templates.find(item => item.template === this.props.voucher.from);
      if(selItem)
        this.setState({template: selItem.template});    
    }
  }

  handleSubmit = (e, refresh = false) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitVoucher({
          html: values.text,
          title: this.props.intl.formatMessage(messages.voucherHeader),
          ...values,
        }, refresh)
      }
    })
  }

  render() {
    const { intl, flowIndex, loading, voucher, templates } = this.props
    // TODO fix  The prop `html` is marked as required in `ContentEditable`, but its value is `undefined`
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            className={s.header}
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <p className={s.description}>{intl.formatMessage(messages.description)}</p>
          <div className={s.container}>
            <div className={cn(s.voucherForm)}>
              <Select
                placeholder={intl.formatMessage(messages.recipient)}
                onChange={(value)=>{
                  this.props.form.setFieldsValue({from:value})
                  this.setState({template: value});
                }}
                allowClear
                value = {this.state.template}
              >
                {templates && templates.map((item) =>
                  <Select.Option key={item.name} value={item.template}>{item.name}</Select.Option>
                )}
              </Select>
              <Form.Item className={cn(s.voucherFormItem,this.state.template !== undefined && s.voucherDisable)}>
                {getFieldDecorator('from', {
                  initialValue: voucher ? voucher.from : '',
                  rules: [
                    { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                  ],
                })(
                  <FloatingLabel placeholder={intl.formatMessage(messages.giver)} isDisabled = {this.state.template !== undefined}/>
                )}
              </Form.Item>
              <Form.Item className={cn(s.voucherFormItem,s.voucherDisable)}>
                {getFieldDecorator('to', {
                  initialValue: 'Your recipient name',
                  rules: [
                    { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                  ],
                })(
                  <FloatingLabel placeholder={intl.formatMessage(messages.receiver)} isDisabled/>
                )}
              </Form.Item>
              <label className={s.messageTitle}>{intl.formatMessage(messages.freeText)}</label>
              <Form.Item className={cn(s.voucherFormItem)}>
                {getFieldDecorator('text', {
                  initialValue: voucher ? voucher.text : '',
                  rules: [
                    { required: true, min: 5, message: intl.formatMessage(formMessages.minLength, { length: 5 }) },
                    { required: true, max: 90, message: intl.formatMessage(formMessages.maxLength, { length: 90 }) },
                  ],
                })(
                  <TextArea className={s.voucherarea} />
                )}
              </Form.Item>
            </div>
          </div>
        </div>
        <PurchaseActions>
          <Button
            type='primary'
            onClick={(e) => this.handleSubmit(e, true)}
          >
            {'buy more products'}
          </Button>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={(e) => this.handleSubmit(e)}
          />
          <Button
            type='primary'
            onClick={(e) => this.handleSubmit(e)}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
      </Form>
    );
    /*
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            className={s.header}
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <p className={s.description}>{intl.formatMessage(messages.description)}</p>
          <div className={s.voucherWrapper}>
            <div style={{backgroundImage: `url(${VOUCHER_TEMPLATE})`, ...voucherStyles.background}}
                 ref={ref => this.voucher = ref}>
              <div style={voucherStyles.header}>{intl.formatMessage(messages.voucherHeader)}</div>
              <div style={{...voucherStyles.receiverLabel, ...voucherStyles.label}}>
                {intl.formatMessage(messages.receiver)}
              </div>
              {getFieldDecorator('from', {
                initialValue: voucher ? voucher.from : '',
                valuePropName: 'html',
              })(
                <ContentEditable style={{...voucherStyles.receiver, ...voucherStyles.input}}/>
              )}
              <div style={{...voucherStyles.giverLabel, ...voucherStyles.label}}>
                {intl.formatMessage(messages.giver)}
              </div>
              {getFieldDecorator('to', {
                initialValue: voucher ? voucher.to : '',
                valuePropName: 'html',
              })(
                <ContentEditable style={{...voucherStyles.giver, ...voucherStyles.input}}/>
              )}
              <div style={{...voucherStyles.bodyLabel, ...voucherStyles.label}}>
                {intl.formatMessage(messages.freeText)}
              </div>
              {getFieldDecorator('text', {
                initialValue: voucher ? voucher.text : '',
                valuePropName: 'html',
              })(
                <ContentEditable style={{...voucherStyles.body, ...voucherStyles.input}}/>
              )}
            </div>
          </div>
        </div>
        <PurchaseActions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button
            type='primary'
            onClick={this.handleSubmit}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
      </React.Fragment>
      
    )
    */
  }
}

const mapState = state => ({
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  voucher: state.purchase.voucher,
  templates: state.purchase.templates,
})

const mapDispatch = {
  submitVoucher,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Voucher)))
