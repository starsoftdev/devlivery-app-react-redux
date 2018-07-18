import React from 'react'
import {connect} from 'react-redux'
import {continueWithoutGift, nextFlowStep, setGiftType} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase7.css'
import {Actions, Card, SectionHeader} from '../../components'
import {ALPHABET} from '../../constants'
import FoodImage from '../../static/food.svg'
import NonFoodImage from '../../static/non_food.svg'
import DonationImage from '../../static/donation.svg'
import VoucherImage from '../../static/voucher.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'

class Purchase7 extends React.Component {
  render() {
    const {giftType, setGiftType, nextFlowStep, intl, flowIndex, continueWithoutGift} = this.props
    const GIFT_TYPES = [
      {key: 'food', title: 'Food', svg: FoodImage},
      {key: 'non_food', title: 'Non Food', svg: NonFoodImage},
      {key: 'donation', title: 'Donation', svg: DonationImage},
      {key: 'voucher', title: 'Voucher', svg: VoucherImage},
    ]
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
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
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => giftType && nextFlowStep()}
          />
          <Button
            type='primary'
            ghost
            onClick={() => continueWithoutGift()}
          >
            {intl.formatMessage(messages.continueWithoutGift)}
          </Button>
          <Button
            type='primary'
            disabled={!giftType}
            onClick={() => nextFlowStep()}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  giftType: state.purchase.giftType,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  setGiftType,
  nextFlowStep,
  continueWithoutGift,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase7))
