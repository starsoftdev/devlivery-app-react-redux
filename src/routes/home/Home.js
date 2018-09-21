import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Home.css'
import DecorTopElement from '../../static/decor_element_top.svg'
import PlusCircleIcon from '../../static/plus-circle.svg'
import {Button, Carousel, Col, Input, Row, Form} from 'antd'
import DownArrow from '../../static/down_arrow.svg'
import chooseItImage from '../../static/POSE_4.png'
import personalizeItImage from '../../static/POSE_5.png'
import sendItImage from '../../static/POSE_6.png'
import AboutUsIcon from '../../static/decor_about.svg'
import {animateScroll} from 'react-scroll'
import {AUTH_PURCHASE_FLOW, CARD_STORE_ROUTE,NEW_ARRIVALS_ROUTE} from '../'
import messages from './messages'
import {setFlow} from '../../reducers/purchase'
import {Link} from '../../components'
import {FloatingLabel} from '../../components';
import cn from 'classnames';
import formMessages from '../../formMessages'
import {registerMailChimp} from '../../reducers/register';

const Card = ({number, image, title, description,intl = {intl}}) =>
  <div className={s.card}>
    <DecorTopElement className={s.cardTopElement}/>
    <span className={s.cardNumber}>{number}</span>
    <div style={{backgroundImage: `url(${image})`}} className={cn(s.cardImage,intl.locale === "de-DE" &&s.cardImage_de)}/>
    <h6 className={s.cardTitle}>{title}</h6>
    <p className={s.cardDescription}>{description}</p>
  </div>

class Home extends React.Component {
  state = {
    emailError : false
  }
  scrollToFirstSection = () => {
    animateScroll.scrollTo(this.firstSection.offsetTop)
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({emailError:false});
        this.props.registerMailChimp(values)
      }
      else {
        this.setState({emailError:true});
      }
    })
  }
  render() {
    const {intl, setFlow} = this.props
    const {getFieldDecorator} = this.props.form
    
    return (
      <React.Fragment>
        <section className={s.heroSection}>
          <h2 className={s.subHeader}>{intl.formatMessage(messages.subHeader)}</h2>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
          <Button type='primary' onClick={() => setFlow(AUTH_PURCHASE_FLOW)}>
            {intl.formatMessage(messages.getStarted)}
          </Button>
          <a className={s.scroll} onClick={this.scrollToFirstSection}>
            {intl.formatMessage(messages.scroll)}
            <DownArrow/>
          </a>
        </section>
        <section ref={ref => this.firstSection = ref} className={s.howItWorksSection}>
          <h3 className={s.howItWorksHeader}>{intl.formatMessage(messages.howItWorks)}</h3>
          <Row gutter={{md: 16, lg: 45}} type='flex' justify='center'>
            <Col xs={24} md={8}>
              <Card
                number={1}
                title={intl.formatMessage(messages.chooseIt)}
                description={intl.formatMessage(messages.chooseItDescription)}
                image={chooseItImage}
                intl = {intl}
              />
            </Col>
            <Col xs={24} md={8}>
              <Card
                number={2}
                title={intl.formatMessage(messages.personalizeIt)}
                description={intl.formatMessage(messages.personalizeItDescription)}
                image={personalizeItImage}
                intl = {intl}
              />
            </Col>
            <Col xs={24} md={8}>
              <Card
                number={3}
                title={intl.formatMessage(messages.sendIt)}
                description={intl.formatMessage(messages.sendItDescription)}
                image={sendItImage}
                intl = {intl}
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
              <h3 className={s.cardsForEverythingHeader}>{intl.formatMessage(messages.cardsForEverything)}</h3>
              <p className={s.cardsForEverythingDescription}>
                {intl.formatMessage(messages.cardsForEverythingDescription)}
                <Link to={CARD_STORE_ROUTE} className={s.sectionBtn}>
                  <PlusCircleIcon className={s.sectionBtnIcon}/>
                  <span className={s.sectionBtnLabel}>{intl.formatMessage(messages.allOurCards)}</span>
                </Link>
              </p>
            </div>
          </div>
        </section>
        <section className={s.giftingSection}>
          <div className={s.giftingBackground}>
            <div className={s.giftingContent}>
              <h3 
                className={cn(
                  s.giftingHeader,
                  intl.locale === "de-DE" &&
                  s.giftingHeader_de
                )}
                >
                {intl.formatMessage(messages.gifting)}
              </h3>
              {
                intl.locale === "de-DE" &&
                <h5 className={s.subgiftingHeader}>{'(Ein überraschendes Geschenk im richtigen Augenblick)'}</h5>
              }
              <p>
                {intl.formatMessage(messages.giftingDescription)}
                <Link to={NEW_ARRIVALS_ROUTE} className={s.sectionBtn}>
                  <PlusCircleIcon className={s.sectionBtnIcon}/>
                  <span className={s.sectionBtnLabel}>{intl.formatMessage(messages.checkItOut)}</span>
                </Link>
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
            customPaging={() => (
              <div className={s.dotWrapper}>
                <div className={s.dot}/>
              </div>
            )}
          >
            <div className={s.feedback}>
              <div style={{background: `url(${'http://via.placeholder.com/90x90'})`}} className={s.feedbackImage}/>
              <h3 className={s.feedbackHeader}>ROGER FEDERER</h3>
              <p className={s.feedbackDescription}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown y of type and scrambled it to make
                a type specimen book.
              </p>
            </div>
            <div className={s.feedback}>
              <div style={{background: `url(${'http://via.placeholder.com/90x90'})`}} className={s.feedbackImage}/>
              <h3 className={s.feedbackHeader}>ROGER FEDERER</h3>
              <p className={s.feedbackDescription}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown y of type and scrambled it to make
                a type specimen book.
              </p>
            </div>
            <div className={s.feedback}>
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
          <div className={intl.locale === "de-DE" ? s.aboutUsContent_de: s.aboutUsContent}>
            <AboutUsIcon className={s.aboutUsIcon}/>
            <h3 className={intl.locale === "de-DE" ? s.aboutUsHeader_de:s.aboutUsHeader}>{intl.formatMessage(messages.about)}</h3>
            <p>
              {intl.formatMessage(messages.aboutDescription)}
            </p>
          </div>
        </section>
        <section className={s.signUpSection}>
          <h3 className={s.signUpHeader}>
            {intl.formatMessage(messages.signUp)}
          </h3>
          <Form onSubmit={this.handleSubmit} className={s.signUpInputWrapper}>
            {getFieldDecorator('email', {
              validateTrigger: 'onSubmit',//'onBlur'
              rules: [
                {required: true, message: intl.formatMessage(formMessages.required)},
                {type: 'email', message: intl.formatMessage(formMessages.emailInvalid)},
              ],
            })(
              <Input 
                type='text' 
                placeholder={intl.formatMessage(messages.email)} 
                className={cn(s.signUpInput, this.state.emailError && s.errorstyle)}/>
            )}
            <Button type='primary' htmlType='submit' className={s.signUpBtn}>{intl.formatMessage(messages.submit)}</Button>
          </Form>
        </section>
      </React.Fragment>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {
  setFlow,
  registerMailChimp
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Home)))
