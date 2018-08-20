import React from 'react'
import {connect} from 'react-redux'
import {addBundle} from '../../reducers/purchase'
import {Button, Col, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AddBundle.css'
import {Actions, SectionHeader} from '../../components'
import PlusGiftIcon from '../../static/plus_round.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {Form} from 'antd'
import messages from './messages'
import {getItemImage} from '../../utils'
import {CARD_IMAGES_PROP, GIFT_IMAGES_PROP} from '../../constants'

// TODO reuse code from Purchase 11
// TODO calculate bundle price correctly
class AddBundle extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addBundle(values)
      }
    })
  }

  getPrice = () => {
    const {card, gift} = this.props
    return (card.price + (gift ? gift.price : 0)).toFixed(2)
  }

  render() {
    const {flowIndex, card, gift, intl} = this.props
    const {getFieldDecorator} = this.props.form
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
              {gift && (
                <PlusGiftIcon className={s.plusIcon}/>
              )}
            </div>
            {gift && (
              <div className={s.giftWrapper}>
                <div style={{backgroundImage: `url(${getItemImage(gift, GIFT_IMAGES_PROP)})`}} className={s.itemImage}/>
                <p className={s.cardInfo}>
                  <span className={s.cardType}>{gift.title}</span>
                  <br/>
                  <span className={s.cardPrice}>{gift.price}</span>
                  <span className={s.cardPriceCurrency}>{gift.currency}</span>
                </p>
              </div>
            )}
          </div>
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
              <span className={s.subtotalValue}>{this.getPrice()}</span>
              <span className={s.subtotalCurrency}>CHF</span>
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
})

const mapDispatch = {
  addBundle,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(AddBundle)))
