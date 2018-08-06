import React from 'react'
import {connect} from 'react-redux'
import {submitVoucher} from '../../reducers/purchase'
import {Button, Form} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Voucher.css'
import {Actions, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import {VOUCHER_TEMPLATE} from '../../constants'
import {loadFont} from '../../utils'
import ContentEditable from 'react-contenteditable'

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
    lineHeight: '32px',
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
  },
  bodyLabel: {
    position: 'absolute',
    top: 312,
  },
  body: {
    position: 'absolute',
    top: 357,
    left: leftMargin,
    right: rightMargin,
  }
}

// TODO add recipient/receiver fields as dropdowns
class Voucher extends React.Component {
  componentDidMount () {
    loadFont('Abril Fatface')
    loadFont('Alex Brush')
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitVoucher({
          voucher: this.voucher.outerHTML,
          title: this.props.intl.formatMessage(messages.voucherHeader),
          ...values,
        })
      }
    })
  }

  render() {
    const {intl, flowIndex, loading, voucher} = this.props
    const {getFieldDecorator} = this.props.form

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
            <div style={{backgroundImage: `url(${VOUCHER_TEMPLATE})`, ...voucherStyles.background}} ref={ref => this.voucher = ref}>
              <style>{'.voucherBody > div {margin-top: 3px;}'}</style>
              <div style={voucherStyles.header}>{intl.formatMessage(messages.voucherHeader)}</div>
              <div style={{...voucherStyles.receiverLabel, ...voucherStyles.label}}>{intl.formatMessage(messages.receiver)}</div>
              {getFieldDecorator('from', {
                initialValue: voucher ? voucher.from : '',
                valuePropName: 'html',
              })(
                <ContentEditable style={{...voucherStyles.receiver, ...voucherStyles.input}}/>
              )}
              <div style={{...voucherStyles.giverLabel, ...voucherStyles.label}}>{intl.formatMessage(messages.giver)}</div>
              {getFieldDecorator('to', {
                initialValue: voucher ? voucher.to : '',
                valuePropName: 'html',
              })(
                <ContentEditable style={{...voucherStyles.giver, ...voucherStyles.input}}/>
              )}
              <div style={{...voucherStyles.bodyLabel, ...voucherStyles.label}}>{intl.formatMessage(messages.freeText)}</div>
              {getFieldDecorator('text', {
                initialValue: voucher ? voucher.text : '',
                valuePropName: 'html',
              })(
                <ContentEditable style={{...voucherStyles.body, ...voucherStyles.input}} className={'voucherBody'}/>
              )}
            </div>
          </div>
        </div>
        <Actions>
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
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  voucher: state.purchase.voucher,
})

const mapDispatch = {
  submitVoucher,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Voucher)))
