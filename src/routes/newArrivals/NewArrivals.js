import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './NewArrivals.css'
import messages from './messages'
import {Button, Carousel, Col, Input, Row} from 'antd'
import {Card, Link} from '../../components'
import debounce from 'lodash/debounce'
import {CARD_IMAGES_PROP, DEFAULT_DEBOUNCE_TIME, FOOD_TYPE, GIFT_IMAGES_PROP, NON_FOOD_TYPE} from '../../constants'
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
      initLoad:false,
      search: undefined,
      slideIndex: 0,
      slideMap: [
        {key:FOOD_GIFTS_INDEX, callback:this.renderFoodSliderView.bind(this)},
        {key:NON_FOOD_GIFTS_INDEX, callback:this.renderNonFoodSliderView.bind(this)},
        {key:CARDS_INDEX, callback:this.renderCardSliderView.bind(this)},
      ]
    }

    this.getCards = debounce(this.props.getCards, DEFAULT_DEBOUNCE_TIME)
    this.getGifts = debounce(this.props.getGifts, DEFAULT_DEBOUNCE_TIME)
  }
  componentWillReceiveProps(nextProps){
    const {loading, foods, nonfoods, cards} = nextProps
    if(!loading.foods && !loading.nonfoods && !loading.cards && !this.state.initLoad)
    {
      let slideMap = [];
      if(foods.length > 0)
          slideMap.push({key:FOOD_GIFTS_INDEX, callback:this.renderFoodSliderView.bind(this)});

      if(nonfoods.length > 0)
        slideMap.push({key:NON_FOOD_GIFTS_INDEX, callback:this.renderNonFoodSliderView.bind(this)});
    
      if(cards.length > 0)
        slideMap.push({key:CARDS_INDEX, callback:this.renderCardSliderView.bind(this)});
        
      this.setState({initLoad:true, slideMap, slideIndex: 0});
    }
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
    
    const {slideMap} = this.state;
    const keyIndex = slideMap[slideIndex].key;
    this.setState({slideIndex})
    
    if ( keyIndex === FOOD_GIFTS_INDEX) {
      this.getGifts({giftType: FOOD_TYPE})
    } else if (keyIndex === NON_FOOD_GIFTS_INDEX) {
      this.getGifts({giftType: NON_FOOD_TYPE})
    } else if (keyIndex === CARDS_INDEX) {
      this.getCards()
    }
  }
  renderFoodSliderView(){
    const {search, slideIndex} = this.state
    const {intl, cards, loading, gifts} = this.props
    return(
      <div key= 'food'>
        <div style={{backgroundImage: `url(${require('../../static/slider_bg.jpg')})`}}
              className={s.carouselItem}>
          {intl.locale !== "de-DE" &&<h1 className={s.header}>{'Fresh Tulips Arrival'}</h1>}
          {
            intl.locale === "de-DE" &&
            <div className={s.sliderContent}>
              <h1 className={s.header_de}>Frisch aus dem Künstler-Atelier<br/>Jetzt anschauen!</h1>
              <p className={s.content}><strong>Zumi weiss:<br/></strong> Kunden zu gewinnen, ist schwer – sie zu halten, noch mehr. Trotzdem vernachlässigen viele Unternehmen ihre Kunden, weil ihnen Zeit und Ressourcen fehlen. Damit vergeben sie viele Geschäftschancen. Das muss nicht mehr sein: Dafür ist unser Service da!</p>
            </div>
          }
          <Link to={PURCHASE1_ROUTE}>
            <Button type='primary'>{'Shop now'}</Button>
          </Link>
        </div>
      </div>
    );
  }
  renderNonFoodSliderView(){
    const {intl, cards, loading, gifts} = this.props
    return(
      <div key= 'nonfood'>
        <div style={{backgroundImage: `url(${require('../../static/slider_bg.jpg')})`}}
              className={s.carouselItem}>
          {intl.locale !== "de-DE" &&<h1 className={s.header}>{'Fresh Tulips Arrival'}</h1>}
          {
            intl.locale === "de-DE" &&
            <div className={s.sliderContent}>
              <h1 className={s.header_de}>Frisch aus dem Künstler-Atelier<br/>Jetzt anschauen!</h1>
              <p className={s.content}><strong>Zumi empfiehlt:<br/></strong> Wie gut kennen Sie Ihre Kunden und Partner? Zeigen Sie Empathie. Nehmen Sie Anteil an ihren grossen Momenten – und investieren Sie in Beziehungen: Mit einer passenden Karte und einem Geschenk im richtigen Augenblick wecken Sie positive Erinnerungen.</p>
            </div>
          }
          <Link to={PURCHASE1_ROUTE}>
            <Button type='primary'>{'Shop now'}</Button>
          </Link>
        </div>
      </div>
    );
  }
  renderCardSliderView(){
    const {intl, cards, loading, gifts} = this.props
    return (
      <div key= 'card'>
        <div style={{backgroundImage: `url(${require('../../static/slider_bg.jpg')})`}}
              className={s.carouselItem}>
          {intl.locale !== "de-DE" &&<h1 className={s.header}>{'Fresh Tulips Arrival'}</h1>}
          {
            intl.locale === "de-DE" &&
            <div className={s.sliderContent}>
              <h1 className={s.header_de}>Frisch aus dem Künstler-Atelier<br/>Jetzt anschauen!</h1>
              <p className={s.content}><strong>Zumi rät:<br/></strong> «Kleine Geschenke erhalten die Freundschaft», sagt das Sprichwort. Das gilt erst recht, wenn das Geschenk überraschend eintrifft – und Sie etwas schenken, das Sie am liebsten selbst erhalten würden.</p>
            </div>
          }
          <Link to={PURCHASE1_ROUTE}>
            <Button type='primary'>{'Shop now'}</Button>
          </Link>
        </div>
      </div>
    );
  }
  render() {
    const {search, slideIndex,slideMap} = this.state
    const {intl, foods,nonfoods, cards, loading} = this.props

    const slideKey = slideMap[slideIndex].key;
    const gifts = slideKey === FOOD_GIFTS_INDEX ? foods:nonfoods;
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
              {slideMap.map(item => item.callback())}
            </Carousel>
          </div>
          <Input.Search
            className={s.search}
            placeholder={intl.formatMessage(messages.search)}
            value={search}
            onChange={this.changeSearch}
          />
          {slideKey === CARDS_INDEX ? (
            !!cards.length ? (
              <Row gutter={20} type='flex'>
                {cards.map((item) =>
                  <Col key={item.id} xs={24} sm={12} md={8} lg={6} className={s.itemWrapper}>
                    <Card
                      item={item}
                      imagesProp={CARD_IMAGES_PROP}
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
                      item={item}
                      imagesProp={GIFT_IMAGES_PROP}
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
