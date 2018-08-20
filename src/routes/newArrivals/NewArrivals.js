import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './NewArrivals.css'
import messages from './messages'
import {Button, Carousel, Col, Input, Row} from 'antd'
import {Card, Link} from '../../components'
import debounce from 'lodash/debounce'
import {DEFAULT_DEBOUNCE_TIME, FOOD_TYPE, NON_FOOD_TYPE} from '../../constants'
import {getCards, getGifts} from '../../reducers/newArrivals'
import ArrowIcon from '../../static/decor_arrow.svg'
import {PURCHASE1_ROUTE} from '../'

const FOOD_GIFTS_INDEX = 0
const NON_FOOD_GIFTS_INDEX = 1
const CARDS_INDEX = 2

class NewArrivals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
      slideIndex: FOOD_GIFTS_INDEX,
    }

    this.getCards = debounce(this.props.getCards, DEFAULT_DEBOUNCE_TIME)
    this.getGifts = debounce(this.props.getGifts, DEFAULT_DEBOUNCE_TIME)
  }

  changeSearch = (e) => {
    const {slideIndex} = this.state
    const search = e.target.value
    this.setState({search})
    if (slideIndex === FOOD_GIFTS_INDEX) {
      this.getGifts({search, giftType: FOOD_TYPE})
    } else if (slideIndex === NON_FOOD_GIFTS_INDEX) {
      this.getGifts({search, giftType: NON_FOOD_TYPE})
    } else if (slideIndex === CARDS_INDEX) {
      this.getCards({search})
    }
  }

  changeSlideIndex = (slideIndex) => {
    this.setState({slideIndex})
    if (slideIndex === FOOD_GIFTS_INDEX) {
      this.getGifts({giftType: FOOD_TYPE})
    } else if (slideIndex === NON_FOOD_GIFTS_INDEX) {
      this.getGifts({giftType: NON_FOOD_TYPE})
    } else if (slideIndex === CARDS_INDEX) {
      this.getCards()
    }
  }

  render() {
    const {search, slideIndex} = this.state
    const {intl, cards, loading, gifts} = this.props

    // TODO add setFlow on PURCHASE1_ROUTE link
    return (
      <div className={s.container}>
        <div className={s.content}>
          <div className={s.carousel}>
            <a className={s.leftBtn} onClick={() => this.carousel.prev()}>
              <ArrowIcon className={s.leftArrow}/>
            </a>
            <a className={s.rightBtn} onClick={() => this.carousel.next()}>
              <ArrowIcon className={s.rightArrow}/>
            </a>
            <Carousel
              ref={ref => this.carousel = ref}
              loop
              customPaging={() => <div/>}
              afterChange={(index) => this.changeSlideIndex(index)}
            >
              <div>
                <div style={{backgroundImage: `url(${require('../../static/slider_bg.jpg')})`}}
                     className={s.carouselItem}>
                  <h1 className={s.header}>{'Fresh Tulips Arrival'}</h1>
                  <Link to={PURCHASE1_ROUTE}>
                    <Button type='primary'>{'Shop now'}</Button>
                  </Link>
                </div>
              </div>
              <div>
                <div style={{backgroundImage: `url(${require('../../static/slider_bg.jpg')})`}}
                     className={s.carouselItem}>
                  <h1 className={s.header}>{'Fresh Tulips Arrival'}</h1>
                  <Link to={PURCHASE1_ROUTE}>
                    <Button type='primary'>{'Shop now'}</Button>
                  </Link>
                </div>
              </div>
              <div>
                <div style={{backgroundImage: `url(${require('../../static/slider_bg.jpg')})`}}
                     className={s.carouselItem}>
                  <h1 className={s.header}>{'Fresh Tulips Arrival'}</h1>
                  <Link to={PURCHASE1_ROUTE}>
                    <Button type='primary'>{'Shop now'}</Button>
                  </Link>
                </div>
              </div>
            </Carousel>
          </div>
          <Input.Search
            className={s.search}
            placeholder={intl.formatMessage(messages.search)}
            value={search}
            onChange={this.changeSearch}
          />
          {slideIndex === CARDS_INDEX ? (
            !!cards.length ? (
              <Row gutter={20} type='flex'>
                {cards.map((item) =>
                  <Col key={item.id} xs={24} sm={12} md={8} lg={6} className={s.itemWrapper}>
                    <Card
                      image={item.images[0] && item.images[0].url}
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
                    />
                  </Col>
                )}
              </Row>
            ) : !loading.cards ? (
              <div className={s.noData}>{intl.formatMessage(messages.noData)}</div>
            ) : null
          ) : (
            !!gifts.length ? (
              <Row gutter={20} type='flex'>
                {gifts.map((item) =>
                  <Col key={item.id} xs={24} sm={12} md={8} lg={6} className={s.itemWrapper}>
                    <Card
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
                    />
                  </Col>
                )}
              </Row>
            ) : !loading.gifts ? (
              <div className={s.noData}>{intl.formatMessage(messages.noData)}</div>
            ) : null
          )
          }
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  ...state.newArrivals,
})

const mapDispatch = {
  getCards,
  getGifts,
}

export default connect(mapState, mapDispatch)(withStyles(s)(NewArrivals))
