import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Home.css'
import {Button, Col, Row} from 'antd'
import DownArrow from '../../static/down_arrow.svg'
import DecorTopElement from '../../static/decor_element_top.svg'
import ChooseItImage from '../../static/choose_it.svg'
import PersonalizeItImage from '../../static/personalize_it.svg'
import SendItImage from '../../static/send_it.svg'

const Card = ({number, image, title, description}) =>
  <div className={s.card}>
    <DecorTopElement className={s.cardTopElement}/>
    <span className={s.cardNumber}>{number}</span>
    <div className={s.cardImageWrapper}>
      <div className={s.cardImageCircle}>
        {React.createElement(image, {className: s.cardImage})}
      </div>
    </div>
    <h6 className={s.cardTitle}>{title}</h6>
    <p className={s.cardDescription}>{description}</p>
  </div>

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <section className={s.heroSection}>
          <h2 className={s.subHeader}>We make it easy and seamless to</h2>
          <h1 className={s.header}>Keep in Touch with Your Contacts</h1>
          <Button type='primary'>Get Started</Button>
          <a className={s.scroll}>
            Scroll
            <DownArrow/>
          </a>
        </section>
        <section className={s.howItWorksSection}>
          <h3 className={s.howItWorksHeader}>How It Works</h3>
          <Row gutter={45} type='flex' justify='center'>
            <Col>
              <Card
                number={1}
                title='Choose it'
                description={`Select a card from out exclusive online catalog`}
                image={ChooseItImage}
              />
            </Col>
            <Col>
              <Card
                number={2}
                title='Personalize it'
                description={`Write a personal message, add pictures and even attach a gift`}
                image={PersonalizeItImage}
              />
            </Col>
            <Col>
              <Card
                number={3}
                title='Send it'
                description={`We'll print, stuff, stamp and mail everything for you.`}
                image={SendItImage}
              />
            </Col>
          </Row>
        </section>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
})

const mapDispatch = {
}

export default connect(mapState, mapDispatch)(withStyles(s)(Home))
