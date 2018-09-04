import React from 'react'
import {connect} from 'react-redux'
import {continueWithoutGift, setGiftType, submitGiftType} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase7.css'
import {Card, PurchaseActions, SectionHeader} from '../../components'
import {ADDITIONAL_GIFT_TYPES, ALPHABET, GIFT_TYPES} from '../../constants'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'

class Purchase7 extends React.Component {
  render() {
    const {giftType, setGiftType, submitGiftType, intl, flowIndex, continueWithoutGift} = this.props
    console.log("submitGiftType",giftType);
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <Row className={s.items} gutter={20} type='flex' align='center'>
            {[...GIFT_TYPES(intl), ...ADDITIONAL_GIFT_TYPES(intl)].map((item, i) =>
              <Col key={item.key} className={s.itemWrapper}>
                <Card
                  className={s.item}
                  title={item.title}
                  svg={item.svg}
                  onClick={() => {
                    setGiftType(item.key)
                    submitGiftType()
                  }}
                  active={item.key === giftType}
                  keyValue={ALPHABET[i]}
                  extra={item.extra}
                />
              </Col>
            )}
          </Row>
        </div>
        <PurchaseActions>
          {/*
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => giftType && submitGiftType()}
          />
          */}
          <Button
            type='primary'
            ghost
            onClick={() => continueWithoutGift()}
          >
            {intl.formatMessage(messages.continueWithoutGift)}
          </Button>
          {/*
          <Button
            type='primary'
            disabled={!giftType}
            onClick={() => submitGiftType()}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
          */}
        </PurchaseActions>
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
  submitGiftType,
  continueWithoutGift,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase7))
