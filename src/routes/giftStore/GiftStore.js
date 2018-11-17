import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './GiftStore.css'
import messages from './messages'
import debounce from 'lodash/debounce'
import {DEFAULT_DEBOUNCE_TIME, GIFT_IMAGES_PROP, GIFT_TYPES, GIFT_GALLERY_PROP} from '../../constants'
import {clearFilters, getGifts, clear} from '../../reducers/gifts'
import {Button, Col, Input, Pagination, Row, Modal, Carousel} from 'antd'
import {Card, PaginationItem, GiftDetails} from '../../components'
import cn from 'classnames'
import {setFlowFromSelectGift} from '../../reducers/purchase';
import {getItemImage} from '../../utils'
import PlusIcon from '../../static/plus.svg'

class GiftStore extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
      showGiftDetails: false,
      giftDetails:null
    }

    this.getGifts = debounce(this.props.getGifts, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  changeSearch = (e) => {
    const search = e.target.value
    this.setState({search})
    this.getGifts({search})
  }

  render() {
    const {search,giftDetails} = this.state
    const {gifts, giftsCount, getGifts, intl, page, pageSize, loading, clearFilters, giftType, setFlowFromSelectGift} = this.props
    
    return (
      <div className={s.container}>
        <div className={s.filters}>
          <h3 className={s.filterHeader}>{intl.formatMessage(messages.collections)}</h3>
          <ul className={s.filterItems}>
            {GIFT_TYPES(intl).map((item) =>
              <li key={item.key}>
                <a
                  onClick={() => getGifts({giftType: item.key})}
                  className={cn(item.key === giftType && s.selected)}
                >
                  {item.title}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className={s.content}>
          <div className={s.actions}>
            <Input.Search
              placeholder={intl.formatMessage(messages.search)}
              value={search}
              onChange={this.changeSearch}
            />
            <Button
              className={s.clearFilters}
              type='primary'
              ghost
              onClick={clearFilters}
            >
              {intl.formatMessage(messages.clearFilters)}
            </Button>
          </div>
          {!!gifts.length ? (
            <Row gutter={20} type='flex'>
              {gifts.map((item) =>
                <Col key={item.id} xs={24} sm={12} md={8} className={s.itemWrapper}>
                  <Card
                    item={item}
                    imagesProp={GIFT_IMAGES_PROP}
                    title={
                      <React.Fragment>
                        {item.title}
                        <br/>
                        <span className={s.price}>
                          {item.price_with_tax}
                          <span className={s.currency}>{item.currency}</span>
                        </span>
                      </React.Fragment>
                    }
                    bordered={false}
                    description={intl.locale === 'de-DE' ? item.short_description_german : item.short_description}
                    onClick={() => {
                      //setFlowFromSelectGift(item);
                      this.setState({showGiftDetails: true,giftDetails:item});
                    }}
                  />
                </Col>
              )}
            </Row>
          ) : !loading.gifts ? (
            <div className={s.noData}>{intl.formatMessage(messages.noData)}</div>
          ) : null}
          {!!gifts.length && (
            <div className={s.footer}>
              <Pagination
                hideOnSinglePage
                current={page}
                total={giftsCount}
                pageSize={pageSize}
                onChange={(current) => getGifts({pagination: {current}})}
                itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
              />
            </div>
          )}
        </div>
        {
          this.state.showGiftDetails && giftDetails &&
          <GiftDetails
            intl={intl}
            giftDetails={giftDetails}
            visible={this.state.showGiftDetails}
            setVisible={(visible)=>this.setState({showGiftDetails:visible})}
            makeorder={(giftDetails)=>setFlowFromSelectGift(giftDetails)}
          />
        }
      </div>
    )
  }
}

const mapState = state => ({
  ...state.gifts,
})

const mapDispatch = {
  getGifts,
  clearFilters,
  clear,
  setFlowFromSelectGift
}

export default connect(mapState, mapDispatch)(withStyles(s)(GiftStore))
