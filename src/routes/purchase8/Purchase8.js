import React from 'react'
import { connect } from 'react-redux'
import { getGifts, setGift, submitGift,buyMoreGift } from '../../reducers/purchase'
import { Button, Col, Layout, Row, Select } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase8.css'
import { Card, Header, Preview, PurchaseActions, SectionHeader } from '../../components'
import cn from 'classnames'
import messages from './messages'
import { GIFT_IMAGES_PROP, GIFT_TYPES } from '../../constants'
import KeyHandler, { KEYPRESS } from 'react-key-handler'

class Purchase8 extends React.Component {
  state = {
    previewCollapsed: false,
    disableSubmit: false
  }

  onPreviewCollapse = (previewCollapsed) => {
    this.setState({ previewCollapsed })
  }

  render() {
    const { previewCollapsed, disableSubmit } = this.state
    const { gift, setGift,buyMoreGift, submitGift, intl, flowIndex, gifts, getGifts, giftType } = this.props

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
          <Layout.Content className={cn(s.contentWrapper, gift && !previewCollapsed && s.withPreview)}>
            <Header className={s.layoutHeader} />
            <div className={s.content}>
              <SectionHeader
                className={s.header}
                header={intl.formatMessage(messages.header)}
                number={flowIndex + 1}
                prefixClassName={s.headerPrefix}
              >
                <Select
                  className={s.giftType}
                  allowClear
                  placeholder={intl.formatMessage(messages.filterByGiftType)}
                  onChange={(giftType) => getGifts({ giftType })}
                  value={giftType}
                >
                  {GIFT_TYPES(intl).map((item) =>
                    <Select.Option key={item.key} value={item.key}>{item.title}</Select.Option>
                  )}
                </Select>
              </SectionHeader>
              <Row className={s.items} gutter={20} type='flex' align='center'>
                {gifts.map((item) =>
                  <Col key={item.id} className={s.itemWrapper} xs={8}>
                    <Card
                      item={item}
                      imagesProp={GIFT_IMAGES_PROP}
                      title={
                        <React.Fragment>
                          {item.title}
                          <br />
                          <span className={s.price}>
                            {item.price}
                            <span className={s.currency}>{item.currency}</span>
                          </span>
                        </React.Fragment>
                      }
                      bordered={false}
                      description={item.short_description}
                      onClick={() => setGift(item)}
                      active={gift && gift.id === item.id}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </Layout.Content>
          <Preview
            onCollapse={this.onPreviewCollapse}
            collapsed={previewCollapsed}
            header={intl.formatMessage(messages.previewHeader)}
            item={gift}
            imagesProp={GIFT_IMAGES_PROP}
          />
        </div>
        <PurchaseActions>
          <Button
            type='primary'
            disabled={!gift || disableSubmit}
            onClick={() => {
              this.setState({ disableSubmit: true });
              buyMoreGift();
              submitGift(-2)
            }}
          >
            {'buy more products'}
          </Button>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => {
              if (gift || !disableSubmit) {
                this.setState({ disableSubmit: true });
                submitGift()
              }
            }}
          />
          <Button
            type='primary'
            disabled={!gift || disableSubmit}
            onClick={() => {
              this.setState({ disableSubmit: true });
              submitGift()
            }}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
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
})

const mapDispatch = {
  setGift,
  submitGift,
  getGifts,
  buyMoreGift
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase8))
