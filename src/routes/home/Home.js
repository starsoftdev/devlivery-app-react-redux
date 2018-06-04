import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Home.css'
import DecorTopElement from '../../static/decor_element_top.svg'
import PlusCircleIcon from '../../static/plus-circle.svg'
import {Button, Carousel, Col, Row, Input} from 'antd'
import DownArrow from '../../static/down_arrow.svg'
import ChooseItImage from '../../static/choose_it.svg'
import personalizeItImage from '../../static/personalize_it.png'
import sendItImage from '../../static/send_it.png'
import AboutUsIcon from '../../static/decor_about.svg'
import { animateScroll } from 'react-scroll'

// imageHeight is needed as wrapper circle should have the same size
const Card = ({number, image, imageHeight, title, description, svg}) =>
  <div className={s.card}>
    <DecorTopElement className={s.cardTopElement}/>
    <span className={s.cardNumber}>{number}</span>
    <div className={s.cardImageWrapper}>
      {svg ? (
        <div className={s.cardImageCircle}>
          {React.createElement(svg)}
        </div>
      ) : (
        <img src={image} style={{height: imageHeight}} className={s.cardImage}/>
      )}
    </div>
    <h6 className={s.cardTitle}>{title}</h6>
    <p className={s.cardDescription}>{description}</p>
  </div>

class Home extends React.Component {
  scrollToFirstSection = () => {
    animateScroll.scrollTo(this.firstSection.offsetTop)
  }

  render() {
    return (
      <React.Fragment>
        <section className={s.heroSection}>
          <h2 className={s.subHeader}>We make it easy and seamless to</h2>
          <h1 className={s.header}>Keep in Touch with Your Contacts</h1>
          <Button type='primary'>Get Started</Button>
          <a className={s.scroll} onClick={this.scrollToFirstSection}>
            Scroll
            <DownArrow/>
          </a>
        </section>
        <section ref={ref => this.firstSection = ref} className={s.howItWorksSection}>
          <h3 className={s.howItWorksHeader}>How It Works</h3>
          <Row gutter={{md: 16, lg: 45}} type='flex' justify='center'>
            <Col xs={24} md={8}>
              <Card
                number={1}
                title='Choose it'
                description={`Select a card from out exclusive online catalog`}
                svg={ChooseItImage}
              />
            </Col>
            <Col xs={24} md={8}>
              <Card
                number={2}
                title='Personalize it'
                description={`Write a personal message, add pictures and even attach a gift`}
                image={personalizeItImage}
                imageHeight={125}
              />
            </Col>
            <Col xs={24} md={8}>
              <Card
                number={3}
                title='Send it'
                description={`We'll print, stuff, stamp and mail everything for you.`}
                image={sendItImage}
                imageHeight={140}
              />
            </Col>
          </Row>
        </section>
        <section className={s.cardsForEverythingSection}>
          <div className={s.cardsForEverythingBackground}>
            <div>
              <img
                className={s.cardsForEverythingImage}
                src={require('../../static/hands-diy-wrapping.jpg')}
                alt='hands DIY wrapping'
              />
            </div>
            <div className={s.cardsForEverythingContent}>
              <h3 className={s.cardsForEverythingHeader}>Cards for Everything</h3>
              <p>
                Access our ever-growing card catalog with ease on your desktop. Gifts connect people, make memories and
                transform relationship. That's why we create gifts of purpose for the moments that matter delivered with
                simplicity & ease.
                <br/>
                <br/>
                Send meaningful cards effortlessly for any occasion.
                <a className={s.sectionBtn}>
                  <PlusCircleIcon className={s.sectionBtnIcon}/>
                  <span className={s.sectionBtnLabel}>All our cards</span>
                </a>
              </p>
            </div>
          </div>
        </section>
        <section className={s.giftingSection}>
          <div className={s.giftingBackground}>
            <div className={s.giftingContent}>
              <h3 className={s.giftingHeader}>Organizational Gifting</h3>
              <p>
                Whether you know exactly what you want or need some brilliant ideas; whether you need one gift or thirty
                - we'll take care of it - every last detail. Express your gratitude to customers, staff and everyone in
                between who keep your company thriving.
                <a className={s.sectionBtn}>
                  <PlusCircleIcon className={s.sectionBtnIcon}/>
                  <span className={s.sectionBtnLabel}>Check it out</span>
                </a>
              </p>
            </div>
            <div>
              <img
                className={s.giftingImage}
                src={require('../../static/woman-order-gift.jpg')}
                alt='woman order gift'
              />
            </div>
          </div>
        </section>
        <section className={s.feedbackSection}>
          <Carousel
            loop
            customPaging={() => <div className={s.dotWrapper}>
              <div className={s.dot}/>
            </div>}
          >
            <div className={s.feedback}>
              <img style={{background: `url(${'http://via.placeholder.com/90x90'})`}} className={s.feedbackImage}/>
              <h3 className={s.feedbackHeader}>ROGER FEDERER</h3>
              <p className={s.feedbackDescription}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown y of type and scrambled it to make
                a type specimen book.
              </p>
            </div>
            <div>
              <img style={{background: `url(${'http://via.placeholder.com/90x90'})`}} className={s.feedbackImage}/>
              <h3 className={s.feedbackHeader}>ROGER FEDERER</h3>
              <p className={s.feedbackDescription}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown y of type and scrambled it to make
                a type specimen book.
              </p>
            </div>
            <div>
              <div style={{background: `url(${'http://via.placeholder.com/90x90'})`}} className={s.feedbackImage}/>
              <h3 className={s.feedbackHeader}>ROGER FEDERER</h3>
              <p className={s.feedbackDescription}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown y of type and scrambled it to make
                a type specimen book.
              </p>
            </div>
          </Carousel>
        </section>
        <section className={s.aboutUsSection}>
          <div className={s.aboutUsContent}>
            <AboutUsIcon className={s.aboutUsIcon}/>
            <h3 className={s.aboutUsHeader}>About Us</h3>
            <p>
              It is a long established fact that a reader will be distracted by the readable content of a page when
              looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution
              of letters, as opposed to using 'Content here, content here', making it look like readable English.
            </p>
          </div>
        </section>
        <section className={s.signUpSection}>
          <h3 className={s.signUpHeader}>
            Sign up to get first access, curated notes about new styles, sales and events.
          </h3>
          <div className={s.signUpInputWrapper}>
            <Input type='text' placeholder='Enter your email address' className={s.signUpInput}/>
            <Button type='primary' className={s.signUpBtn}>Submit</Button>
          </div>
        </section>
      </React.Fragment>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Home))
