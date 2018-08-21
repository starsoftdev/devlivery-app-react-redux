import React from 'react'
import {connect} from 'react-redux'
import {addBundle, confirmDonation, confirmVoucher} from '../../reducers/purchase'
import {Button, Col, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddBundle.css'
import {Actions, OrderItems, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {Form} from 'antd'
import messages from './messages'

// TODO calculate bundle price correctly
class AddBundle extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // send request depending on selected gift option
        if (this.props.donationOrg) {
          this.props.confirmDonation(values)
        } else if (this.props.voucher) {
          this.props.confirmVoucher(values)
        } else {
          this.props.addBundle(values)
        }
      }
    })
  }

  // bundle is not created on this step so price needs to be calculated on frontend side
  getPrice = () => {
    const {card, gift, donationAmount, voucher} = this.props
    let subtotal = 0
    let total = 0

    if (card) {
      subtotal += card.price
      total += card.price_with_tax
    }
    if (gift) {
      subtotal += gift.price
      total += gift.price_with_tax
    }
    if (donationAmount) {
      subtotal += donationAmount
      total += donationAmount
    }
    if (voucher) {
      // TODO do not use hardcoded values
      subtotal += 200
      total += 220
    }

    return {
      total: total.toFixed(2),
      subtotal: subtotal.toFixed(2),
    }
  }

  render() {
    const {flowIndex, card, gift, intl, voucher, donationAmount, donationOrg, hideAmount} = this.props
    const {getFieldDecorator} = this.props.form

    // create donation obj similar to backend response (donation is not submitted on this step)
    const donation = donationOrg ? {
      organization: donationOrg,
      amount: donationAmount,
      hide_amount: hideAmount,
    } : null

    const {total, subtotal} = this.getPrice()

    return card ? (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <OrderItems card={card} gift={gift} voucher={voucher} donation={donation}/>
          <div className={s.orderDetails}>
            <Form.Item>
              {getFieldDecorator('title', {
              })(
                <Input placeholder={intl.formatMessage(messages.bundleName)}/>
              )}
            </Form.Item>
          </div>
          <Row type='flex' align='center' gutter={20} className={s.subtotalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.subtotal)}</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>{subtotal}</span>
              <span className={s.subtotalCurrency}>{'CHF'}</span>
            </Col>
          </Row>
          <Row type='flex' align='center' gutter={20} className={s.totalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.total)}</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>{total}</span>
              <span className={s.subtotalCurrency}>{'CHF'}</span>
            </Col>
          </Row>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button
            type='primary'
            htmlType='submit'
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </Form>
    ) : null
  }
}

const mapState = state => ({
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  card: state.purchase.card,
  gift: state.purchase.gift,
  voucher: state.purchase.voucher,
  donationAmount: state.purchase.donationAmount,
  donationOrg: state.purchase.donationOrg,
  hideAmount: state.purchase.hideAmount,
})

const mapDispatch = {
  addBundle,
  confirmDonation,
  confirmVoucher,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(AddBundle)))
