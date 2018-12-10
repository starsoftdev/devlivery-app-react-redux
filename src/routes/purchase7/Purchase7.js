import React from 'react'
import { connect } from 'react-redux'
import { continueWithoutGift, setGiftType, submitGiftType, submitGift,setVoucher,VOUCHER_STATE } from '../../reducers/purchase'
import { Button, Col, Row } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase7.css'
import { Card, PurchaseActions, SectionHeader } from '../../components'
import { FOOD_TYPE,NON_FOOD_TYPE,DONATION_TYPE,VOUCHER_TYPE,ADDITIONAL_GIFT_TYPES, ALPHABET, GIFT_TYPES, OTHER_TYPES, CONTINUE_WITHOUT_GIFT } from '../../constants'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import messages from './messages'

class Purchase7 extends React.Component {
  state = {
    multi_products: [],
    has_Food: false,
    has_nonFood: false,
  }
  componentWillMount() {
    this.loadLocalStorage();
  }
  async loadLocalStorage() {
    var initState = await localStorage.getItem(VOUCHER_STATE);
    if(initState)
    {
      this.props.setVoucher(JSON.parse(initState));
    }
  }
  componentWillReceiveProps(nextProps)
  {
    if(nextProps.gifts !== this.props.gifts)
    {
      let has_Food = false;
      let has_nonFood = false;
      for(var i=0; i<nextProps.giftIds.length; i++)
      {
        const gift = nextProps.gifts.find(item => item.id+'' === nextProps.giftIds[i]+'')
        if(gift)
        {
          if(gift.type === 'Non Food')
            has_nonFood = true;
          else has_Food = true;
        }
      }
      this.setState({has_nonFood,has_Food});
    }
  }
  render() {
    const { giftType, setGiftType, submitGift, bundleId, gifts, giftIds, submitGiftType, intl, flowIndex, continueWithoutGift,donationOrg,voucher } = this.props
    
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <Row className={s.items} gutter={20} type='flex' align='center'>
            {[...GIFT_TYPES(intl),...ADDITIONAL_GIFT_TYPES(intl)].map((item, i) =>
              {
                let active = false;
                switch(item.key)
                {
                  case FOOD_TYPE: {
                    active = this.state.has_Food;
                    break;
                  }
                  case NON_FOOD_TYPE: {
                    active = this.state.has_nonFood;
                    break;
                  }
                  case DONATION_TYPE: {
                    active = donationOrg ? true : false;
                    break;
                  }
                  case VOUCHER_TYPE: {
                    active =  voucher ? true : false;
                    break;
                  }
                }
                      
                return (
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
                    active={active}
                    keyValue={ALPHABET[i]}
                    extra={item.extra}
                  />
                </Col>);
              }
            )}
            {OTHER_TYPES(intl).map((item, i) =>
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
                  keyValue={ALPHABET[i]}
                  extra={item.extra}
                />
              </Col>
            )}
          </Row>
        </div>
        {
          giftIds.length > 0 || voucher || donationOrg?
            <PurchaseActions>
              <KeyHandler
                keyEventName={KEYPRESS}
                keyCode={13}
                onKeyHandle={() => submitGift(1)}
              />
              <Button
                type='primary' 
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
  gifts: state.purchase.gifts,
  donationOrg: state.purchase.donationOrg,
  voucher: state.purchase.voucher
})

const mapDispatch = {
  setGiftType,
  submitGiftType,
  continueWithoutGift,
  submitGift,
  setVoucher
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase7))
