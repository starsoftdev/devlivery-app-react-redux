import React from 'react'
import {connect} from 'react-redux'
import {confirmDonation} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ConfirmDonation.css'
import {Actions, SectionHeader} from '../../components'
import PlusGiftIcon from '../../static/plus_round.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {Form} from 'antd'
import messages from './messages'
import {getItemImage} from '../../utils'
import {CARD_IMAGES_PROP} from '../../constants'

class ConfirmDonation extends React.Component {
  getPrice = () => {
    const {card, donationAmount} = this.props
    return (card.price + (+donationAmount)).toFixed(2)
  }

  render() {
    const {flowIndex, card, intl, donationOrg, donationAmount, confirmDonation} = this.props
    // TODO price with vat?
    return card ? (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <div className={s.orderInfo}>
            <div className={s.cardWrapper}>
              <div style={{backgroundImage: `url(${getItemImage(card, CARD_IMAGES_PROP)})`}} className={s.itemImage}/>
              <p className={s.cardInfo}>
                <span className={s.cardType}>{card.title}</span>
                <br/>
                <span className={s.cardPrice}>{card.price}</span>
                <span className={s.cardPriceCurrency}>{card.currency}</span>
              </p>
              {donationOrg && (
                <PlusGiftIcon className={s.plusIcon}/>
              )}
            </div>
            {donationOrg && (
              <div className={s.giftWrapper}>
                <div style={{backgroundImage: `url(${getItemImage(donationOrg, 'logo')})`}} className={s.itemImage}/>
                <p className={s.cardInfo}>
                  <span className={s.cardType}>{donationOrg.name}</span>
                  <br/>
                  <span className={s.cardPrice}>{donationAmount}</span>
                  <span className={s.cardPriceCurrency}>{'CHF'}</span>
                </p>
              </div>
            )}
          </div>
          <Row type='flex' align='center' gutter={20} className={s.subtotalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.subtotal)}</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>{this.getPrice()}</span>
              <span className={s.subtotalCurrency}>{'CHF'}</span>
            </Col>
          </Row>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={confirmDonation}
          />
          <Button
            type='primary'
            onClick={confirmDonation}
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
  donationOrg: state.purchase.donationOrg,
  donationAmount: state.purchase.donationAmount,
})

const mapDispatch = {
  confirmDonation,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ConfirmDonation))
