import React from 'react'
import { connect } from 'react-redux'
import { continueWithoutGift, setGiftType, submitGiftType, submitGift, MULTIPRODUCT } from '../../reducers/purchase'
import { Button, Col, Row } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase7.css'
import { Card, PurchaseActions, SectionHeader } from '../../components'
import { ADDITIONAL_GIFT_TYPES, ALPHABET, GIFT_TYPES, OTHER_TYPES, CONTINUE_WITHOUT_GIFT } from '../../constants'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import messages from './messages'

class Purchase7 extends React.Component {
  state = {
    multi_products: []
  }
  async componentWillMount(){
    var multi_products = JSON.parse(localStorage.getItem(MULTIPRODUCT));
    if(multi_products == null)
      multi_products = [];
    this.setState({multi_products})
  }
  render() {
    const { giftType, setGiftType, submitGift, bundleId, giftIds, submitGiftType, intl, flowIndex, continueWithoutGift } = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <Row className={s.items} gutter={20} type='flex' align='center'>
            {[...GIFT_TYPES(intl), ...ADDITIONAL_GIFT_TYPES(intl), ...OTHER_TYPES(intl)].map((item, i) =>
              <Col key={item.key} className={s.itemWrapper} xs={8}>
                <Card
                  className={s.item}
                  title={item.title}
                  svg={item.svg}
                  onClick={() => {
                    if (item.key === CONTINUE_WITHOUT_GIFT) {
                      continueWithoutGift()
                    }
                    else {
                      setGiftType(item.key)
                      submitGiftType()
                    }
                  }}
                  active={this.state.multi_products.includes(item.key)}
                  keyValue={ALPHABET[i]}
                  extra={item.extra}
                />
              </Col>
            )}
          </Row>
        </div>
        {
          giftIds.length > 0 ?
            <PurchaseActions>
              <KeyHandler
                keyEventName={KEYPRESS}
                keyCode={13}
                onKeyHandle={() => submitGift(1)}
              />
              <Button
                type='primary'
                ghost
                onClick={() => {
                  submitGift(1);
                }}
              >
                {intl.formatMessage(messages.submit)}
              </Button>
            </PurchaseActions>
            : <PurchaseActions />
        }
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  giftType: state.purchase.giftType,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  bundleId: state.purchase.bundleId,
  giftIds: state.purchase.giftIds,
})

const mapDispatch = {
  setGiftType,
  submitGiftType,
  continueWithoutGift,
  submitGift
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase7))
