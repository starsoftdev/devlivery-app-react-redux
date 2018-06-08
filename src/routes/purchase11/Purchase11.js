import React from 'react'
import {connect} from 'react-redux'
import {submitShipping} from '../../reducers/purchase'
import {Button, Col, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase11.css'
import {Actions, SectionHeader} from '../../components'
import PlusIcon from '../../static/plus_round.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {Form} from 'antd/lib/index'
import formMessages from '../../formMessages'
import cardImage from '../../static/modern_card_style.png'
import giftImage from '../../static/gift1.png'

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
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={'Order Confirmation'}
            number={11}
            prefixClassName={s.headerPrefix}
          />
          <div className={s.orderInfo}>
            <div className={s.cardWrapper}>
              <div>
                <img src={cardImage} className={s.cardImage}/>
              </div>
              <PlusIcon className={s.plusIcon}/>
              <p className={s.cardInfo}>
                <span className={s.cardType}>Christmas Card</span>
                <br/>
                <span className={s.cardPrice}>20.00</span>
                <span className={s.cardPriceCurrency}>CHF</span>
              </p>
            </div>
            <div className={s.giftWrapper}>
              <div>
                <img src={giftImage} className={s.giftImage}/>
              </div>
              <p className={s.cardInfo}>
                <span className={s.cardType}>Fine Foodie</span>
                <br/>
                <span className={s.cardPrice}>78.00</span>
                <span className={s.cardPriceCurrency}>CHF</span>
              </p>
            </div>
          </div>
          <div className={s.orderDetails}>
            <Row type='flex' align='center' gutter={20}>
              <Col xs={24} sm={12}>
                <section>
                  <h3 className={s.cardTitle}>MERRY CHRISTMAS</h3>
                  <p>
                    May your life be filled with joy and happiness and may each new day bring you moments to cherish
                  </p>
                </section>
              </Col>
              <Col xs={24} sm={12}>
                <ul className={s.giftDetails}>
                  <li>Grapes</li>
                  <li>Pineapple</li>
                  <li>Kiwi</li>
                  <li>Mandarin</li>
                </ul>
              </Col>
            </Row>
          </div>
          <Row type='flex' align='center' gutter={20} className={s.subtotalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>Subtotal:</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>98.00</span>
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
    )
  }
}

const mapState = state => ({
  loading: state.purchase.loading,
})

const mapDispatch = {
  submitShipping,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Purchase11)))
