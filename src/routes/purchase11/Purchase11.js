import React from 'react'
import {connect} from 'react-redux'
import {submitShipping} from '../../reducers/purchase'
import {Button, Col, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase11.css'
import {Actions, SectionHeader} from '../../components'
import PlusGiftIcon from '../../static/plus_round.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {Form} from 'antd'
import formMessages from '../../formMessages'

class Purchase11 extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    // TODO
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    this.props.submitShipping()
    // }
    // })
  }

  render() {
    const {flowIndex, order} = this.props
    const {getFieldDecorator} = this.props.form
    return order ? (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={'Order Confirmation'}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <div className={s.orderInfo}>
            <div className={s.cardWrapper}>
              <div>
                <img src={order.items.card.images[0].url} className={s.cardImage}/>
              </div>
              {order.items.gifts[0] && (
                <PlusGiftIcon className={s.plusIcon}/>
              )}
              <p className={s.cardInfo}>
                <span className={s.cardType}>{order.items.card.title}</span>
                <br/>
                <span className={s.cardPrice}>{order.items.card.price}</span>
                <span className={s.cardPriceCurrency}>{order.items.card.currency}</span>
              </p>
            </div>
            {order.items.gifts[0] && (
              <div className={s.giftWrapper}>
                <div>
                  <img src={order.items.gifts[0].gift.image[0].url} className={s.giftImage}/>
                </div>
                <p className={s.cardInfo}>
                  <span className={s.cardType}>{order.items.gifts[0].gift.title}</span>
                  <br/>
                  <span className={s.cardPrice}>{order.items.gifts[0].gift.price}</span>
                  <span className={s.cardPriceCurrency}>{order.items.gifts[0].gift.currency}</span>
                </p>
              </div>
            )}
          </div>
          <div className={s.orderDetails}>
            <Row type='flex' align='center' gutter={20}>
              <Col xs={24} sm={12}>
                <section>
                  <h3 className={s.cardTitle}>BUNDLE TITLE</h3>
                  <p>
                    CARD DESCRIPTION
                  </p>
                </section>
              </Col>
              <Col xs={24} sm={12}>
                {order.items.gifts[0] && order.items.gifts[0].gift.description}
              </Col>
            </Row>
          </div>
          <Row type='flex' align='center' gutter={20} className={s.subtotalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>Subtotal:</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>{order.total}</span>
              <span className={s.subtotalCurrency}>CHF</span>
            </Col>
          </Row>
          <section className={s.section}>
            <h2 className={s.sectionHeader}>Shipping</h2>
            <Row gutter={20} type='flex' align='center'>
              <Col xs={24} sm={12}>
                <Form.Item>
                  {getFieldDecorator('deliver_time', {
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Select placeholder={'Deliver time'} className={s.select}>
                      {[].map((item, i) =>
                        <Select.Option key={item} value={item}>{item}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item>
                  {getFieldDecorator('deliver_place', {
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Select placeholder={'Where to send'} className={s.select}>
                      {[].map((item, i) =>
                        <Select.Option key={item} value={item}>{item}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </section>
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
            Proceed to checkout
          </Button>
        </Actions>
      </Form>
    ) : null
  }
}

const mapState = state => ({
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  order: state.purchase.order,
})

const mapDispatch = {
  submitShipping,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Purchase11)))
