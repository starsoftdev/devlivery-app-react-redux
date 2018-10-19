import React from 'react'
import { connect } from 'react-redux'
import { addBundle, confirmDonation, confirmVoucher, updateBundle,nextFlowStep,removeDontationFromBundle, removeVoucherFromBundle } from '../../reducers/purchase'
import { Button, Col, Input, Row } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddBundle.css'
import { Actions, OrderItems, SectionHeader } from '../../components'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import { Form } from 'antd'
import messages from './messages'
import { FloatingLabel } from '../../components';
import formMessages from '../../formMessages'

// TODO calculate bundle price correctly
class AddBundle extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // send request depending on selected gift option
        /*
        if (this.props.donationOrg) {
          this.props.confirmDonation(values)
        } else if (this.props.voucher) {
          this.props.confirmVoucher(values)
        } else {
          this.props.addBundle(values)
        }
        */
        this.props.updateBundle({ ...values, saved: 1, _method:'PUT' },()=>this.props.nextFlowStep() )
      }
    })
  }

  // bundle is not created on this step so price needs to be calculated on frontend side
  getPrice = () => {
    const { card, gift, donationAmount, voucher } = this.props
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
      subtotal += voucher.price
      total += voucher.price_with_tax
    }

    return {
      total: total.toFixed(2),
      subtotal: subtotal.toFixed(2),
    }
  }

  render() {
    const { flowIndex,  intl, donationAmount, donationOrg, hideAmount, bundle } = this.props
    const { getFieldDecorator } = this.props.form
    console.log('bundle',bundle);
    const card = bundle && bundle.bundle_card && bundle.bundle_card.card ? bundle.bundle_card.card : null;
    const gifts = bundle && bundle.bundle_gifts ? bundle.bundle_gifts : []
    const voucher = bundle && bundle.voucher
    const donation = bundle && bundle.donation
    
    return card ? (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <OrderItems {...this.props} card={card} gift={gifts.length > 0 && gifts[0].gift} giftcount = {gifts.length} voucher={voucher} donation={donation} card={card}/>
          <div className={s.orderDetails}>
            <Form.Item>
              {getFieldDecorator('title', {
                initialValue: '',
                rules: [
                  { required: true, min: 5, message: intl.formatMessage(formMessages.minLength, { length: 5 }) },
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.bundleName)} />
              )}
            </Form.Item>
          </div>
          <Row type='flex' align='center' gutter={20} className={s.subtotalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.subtotal)}</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>{bundle.total ? bundle.total : 0}</span>
              <span className={s.subtotalCurrency}>{'CHF'}</span>
            </Col>
          </Row>
          <Row type='flex' align='center' gutter={20} className={s.totalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.tax)}</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>{(bundle.total_with_tax - bundle.total).toFixed(2)}</span>
              <span className={s.subtotalCurrency}>{'CHF'}</span>
            </Col>
          </Row>
          <Row type='flex' align='center' gutter={20} className={s.totalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.total)}</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>{bundle.total_with_tax ? bundle.total_with_tax : 0}</span>
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
  bundle: state.purchase.bundle
})

const mapDispatch = {
  addBundle,
  confirmDonation,
  confirmVoucher,
  updateBundle,
  nextFlowStep,
  removeDontationFromBundle,
  removeVoucherFromBundle
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(AddBundle)))
