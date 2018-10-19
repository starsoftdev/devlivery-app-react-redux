import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './About.css'
import {Button, Col, Input, Row, Form} from 'antd'
import messages from './messages'
import {FloatingLabel} from '../../components';
import pose8Image from '../../static/POSE_8.png'
import {registerMailChimp} from '../../reducers/register';
import formMessages from '../../formMessages'
import cn from 'classnames';

class About extends React.Component {
  state = {
    emailError : false
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({emailError:false});
        this.props.registerMailChimp(values,()=>{
          this.props.form.setFieldsValue({
            email: null
          });
        })
      }
      else {
        this.setState({emailError:true});
      }
    })
  }
  render() {
    const {intl} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <React.Fragment>
        <div className={s.bannerSectionWrapper}>
          <div className={s.bannerSection}>
            <img src={require('../../static/banner_img.jpg')} className={s.sectionImage}/>
          </div>
        </div>
        <section className={s.aboutUsSectionWrapper}>
          <div className={s.aboutUsSection}>
            <Row gutter={40} type='flex'>
              <Col xs={24} sm={24}>
                <div className={s.aboutUsContent}>
                  <h3 className={s.aboutUsHeader}>{intl.formatMessage(messages.about)}</h3>
                  <p className={s.aboutDescription}>
                    {intl.formatMessage(messages.aboutDescription)}
                  </p>
                </div>
                <Row gutter={40} type='flex'>
                  <Col xs={16} sm={16} className={s.quoteCotainer}>
                    <p className={s.feedback}>
                      {intl.formatMessage(messages.quote)}
                      <br/>
                      <b>- Adam Smith</b>
                    </p>
                  </Col>
                  <Col xs={8} sm={8}  className={s.quoteImageCotanier}>
                    <div className={s.poseImageContainer}>
                      <img src={require('../../static/POSE_8.png')} className={s.poseImage}/>
                    </div>
                  </Col>
                </Row>
                <div>
                  <p className={s.info}>
                    {intl.formatMessage(messages.aboutDescription1)}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        <section className={s.signUpSection}>
          <h3 className={s.signUpHeader}>
            {intl.formatMessage(messages.signUp)}
          </h3>
          <Form onSubmit={this.handleSubmit} className={s.signUpInputWrapper}>
            {getFieldDecorator('email', {
              validateTrigger: 'onBlur',
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

const mapDispatch = {registerMailChimp}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(About)))
