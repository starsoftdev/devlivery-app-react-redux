import React from 'react'
import {connect} from 'react-redux'
import {getGifts, setGift, submitGift} from '../../reducers/purchase'
import {Button, Col, Layout, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase8.css'
import {Card, Header, SectionHeader} from '../../components'
import cn from 'classnames'
import Preview from './Preview'
import messages from './messages'
import {GIFT_TYPES} from '../../constants'

class Purchase8 extends React.Component {
  state = {
    previewCollapsed: false,
  }

  onPreviewCollapse = (previewCollapsed) => {
    this.setState({previewCollapsed})
  }

  render() {
    const {previewCollapsed} = this.state
    const {gift, setGift, submitGift, intl, flowIndex, gifts, getGifts, giftType} = this.props

    return (
      <div className={s.container}>
        {previewCollapsed && (
          <Button
            type='primary'
            className={s.previewBtn}
            onClick={() => this.onPreviewCollapse(false)}
          >
            Preview
          </Button>
        )}
        <Layout.Content className={cn(s.contentWrapper, !previewCollapsed && s.withPreview)}>
          <Header className={s.layoutHeader}/>
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
                onChange={(giftType) => getGifts({giftType})}
                value={giftType}
              >
                {GIFT_TYPES(intl).map((item) =>
                  <Select.Option key={item.key} value={item.key}>{item.title}</Select.Option>
                )}
              </Select>
            </SectionHeader>
            <Row className={s.items} gutter={20} type='flex' align='center'>
              {gifts.map((item) =>
                <Col key={item.id} className={s.itemWrapper}>
                  <Card
                    className={s.item}
                    image={item.image[0] && item.image[0].url}
                    title={
                      <React.Fragment>
                        {item.title}
                        <br/>
                        <span className={s.price}>
                          {item.price}
                          <span className={s.currency}>{item.currency}</span>
                        </span>
                      </React.Fragment>
                    }
                    bordered={false}
                    description={item.description}
                    onClick={() => {
                      setGift(item)
                      submitGift()
                    }}
                    active={gift && gift.id === item.id}
                  />
                </Col>
              )}
            </Row>
          </div>
        </Layout.Content>
        <Preview onCollapse={this.onPreviewCollapse} collapsed={previewCollapsed}/>
      </div>
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
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase8))
