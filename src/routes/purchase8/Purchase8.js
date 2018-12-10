import React from 'react'
import { connect } from 'react-redux'
import { getGifts, setGift, submitGift, buyMoreGift } from '../../reducers/purchase'
import { Button, Col, Layout, Row, Select, message } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase8.css'
import { Card, Header, Preview, PurchaseActions, SectionHeader,GiftDetails } from '../../components'
import cn from 'classnames'
import messages from './messages'
import { GIFT_IMAGES_PROP, GIFT_TYPES, GIFT_GALLERY_PROP } from '../../constants'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import { triggerResizeEvent } from '../../utils';

class Purchase8 extends React.Component {
  state = {
    previewCollapsed: false,
    disableSubmit: false,
    showGiftDetails: false
  }

  onPreviewCollapse = (previewCollapsed) => {
    triggerResizeEvent();
    this.setState({ previewCollapsed })
  }

  render() {
    const { previewCollapsed, disableSubmit } = this.state
    const { gift, giftIds, setGift, buyMoreGift, submitGift, intl, flowIndex, gifts, getGifts, giftType,newrecipient } = this.props
    const gift_preview = gift ? gift: (gifts && giftIds && giftIds.length > 0 ? gifts.find(item=>item.id===giftIds[giftIds.length-1]):null)
    return (
      <React.Fragment>
        <div className={s.container}>
          {previewCollapsed && (
            <Button
              type='primary'
              className={s.previewBtn}
              onClick={() => this.onPreviewCollapse(false)}
            >
              {intl.formatMessage(messages.preview)}
            </Button>
          )}
          <Layout.Content className={cn(s.contentWrapper, gift_preview && !previewCollapsed && s.withPreview)}>
            <Header className={s.layoutHeader} />
            <div className={s.content}>
              <SectionHeader
                className={s.header}
                header={intl.formatMessage(messages.header)}
                number={flowIndex + 1}
                prefixClassName={s.headerPrefix}
              >
                
              </SectionHeader>
              <Row className={s.items} gutter={20} type='flex' align='center'>
                {gifts.filter(item=>!((item.stock > 0 && item.stock < newrecipient.length) || item.stock == 0)).map((item) =>
                  <Col key={item.id} className={s.itemWrapper} xs={8}>
                    <Card
                      item={item}
                      imagesProp={GIFT_IMAGES_PROP}
                      title={
                        <React.Fragment>
                          {item.title}
                          <br />
                          <span className={s.price}>
                            <span className={s.currency}>{item.currency} </span>
                            {item.price_with_tax}
                          </span>
                        </React.Fragment>
                      }
                      bordered={false}
                      description={intl.locale === 'de-DE' ? item.short_description_german : item.short_description}
                      onClick={() => {
                        setGift(item)
                      }}
                      active={giftIds && giftIds.includes(item.id)}
                      imageStyle={s.cardimage}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </Layout.Content>
          <Preview
            intl = {intl}
            onCollapse={this.onPreviewCollapse}
            collapsed={previewCollapsed}
            header={intl.formatMessage(messages.previewHeader)}
            item={gift_preview}
            imagesProp={gift_preview && gift_preview[GIFT_GALLERY_PROP] && gift_preview[GIFT_GALLERY_PROP].length > 0 ? GIFT_GALLERY_PROP : GIFT_IMAGES_PROP}
            onClickMagnifier={()=>this.setState({showGiftDetails:true})}
          />
        </div>
        <PurchaseActions>
          <Button
            type='primary'
            //disabled={!gift || disableSubmit}
            onClick={() => {
              this.setState({ disableSubmit: true });
              localStorage.setItem('gift_ids', JSON.stringify(giftIds))
              buyMoreGift();
              submitGift(-2)
            }}
          >
            {'SAVE AND BUY MORE PRODUCTS'}
          </Button>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => {
              if (!disableSubmit) {
                this.setState({ disableSubmit: true });
                submitGift()
              }
            }}
          />
          <Button
            type='primary'
            disabled={disableSubmit}
            onClick={() => {
              this.setState({ disableSubmit: true });
              submitGift()
            }}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
        {
          this.state.showGiftDetails && gift &&
          <GiftDetails
            intl={intl}
            giftDetails={gift}
            visible={this.state.showGiftDetails}
            setVisible={(visible)=>this.setState({showGiftDetails:visible})}
            disableMakeOrder={true}
          />
        }
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  gifts: state.purchase.gifts,
  gift: state.purchase.gift,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  giftType: state.purchase.giftType,
  giftIds: state.purchase.giftIds,
  newrecipient: state.purchase.newrecipient
})

const mapDispatch = {
  setGift,
  submitGift,
  getGifts,
  buyMoreGift
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase8))
