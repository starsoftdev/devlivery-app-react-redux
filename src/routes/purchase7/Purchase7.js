import React from 'react'
import {connect} from 'react-redux'
import {setGiftType, submitGiftType} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase7.css'
import {Card} from '../../components'
import {ALPHABET} from '../../constants'
import ArrowIcon from '../../static/decor_arrow.svg'
import FoodImage from '../../static/food.svg'
import NonFoodImage from '../../static/non_food.svg'
import DonationImage from '../../static/donation.svg'
import VoucherImage from '../../static/voucher.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'

const GIFT_TYPES = [
  {key: 'food', title: 'Food', svg: FoodImage},
  {key: 'non_food', title: 'Non Food', svg: NonFoodImage},
  {key: 'donation', title: 'Donation', svg: DonationImage},
  {key: 'voucher', title: 'Voucher', svg: VoucherImage},
]

class Purchase7 extends React.Component {
  render() {
    const {giftType, setGiftType, submitGiftType} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <h1 className={s.header}>
            <span className={s.headerPrefix}>
              7
              <ArrowIcon className={s.arrowIcon}/>
            </span>
            Add Gift?
          </h1>
          <Row className={s.items} gutter={20} type='flex' align='center'>
            {GIFT_TYPES.map((item, i) =>
              <Col key={item.key} className={s.itemWrapper}>
                <Card
                  className={s.item}
                  title={item.title}
                  svg={item.svg}
                  onClick={() => setGiftType(item.key)}
                  active={item.key === giftType}
                  keyValue={ALPHABET[i]}
                  extra={item.extra}
                />
              </Col>
            )}
          </Row>
        </div>
        <div className={s.actions}>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={submitGiftType}
          />
          <Button
            type='primary'
            className={s.submitBtn}
            disabled={!giftType}
            onClick={submitGiftType}
          >
            Submit
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  giftType: state.purchase.giftType,
  loading: state.purchase.loading,
})

const mapDispatch = {
  setGiftType,
  submitGiftType,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase7))
