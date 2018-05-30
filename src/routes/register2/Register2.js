import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Input, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register2.css'
import ArrowIcon from '../../static/decor_arrow.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'
import {setIndividualDetails} from '../../reducers/register'
import moment from 'moment'

class Register2 extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.setIndividualDetails(values)
      }
    })
  }

  render() {
    const {individualDetails} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <section>
            <h1 className={s.header}>
            <span className={s.headerPrefix}>
              2
              <ArrowIcon className={s.arrowIcon}/>
            </span>
              Individual Details
            </h1>
            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Form.Item>
                  {getFieldDecorator('first_name', {
                    initialValue: individualDetails && individualDetails.first_name,
                    rules: [
                      {required: true, message: formMessages.required, whitespace: true},
                    ],
                  })(
                    <Input placeholder={'First Name'}/>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item>
                  {getFieldDecorator('last_name', {
                    initialValue: individualDetails && individualDetails.last_name,
                    rules: [
                      {required: true, message: formMessages.required, whitespace: true},
                    ],
                  })(
                    <Input placeholder={'Last Name'}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              {getFieldDecorator('email', {
                initialValue: individualDetails && individualDetails.email,
                rules: [
                  {required: true, message: formMessages.required},
                  {type: 'email', message: formMessages.emailInvalid},
                ],
              })(
                <Input placeholder={'Email'}/>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('phone', {
                initialValue: individualDetails && individualDetails.phone,
                rules: [
                  {required: true, message: formMessages.required},
                ],
              })(
                <Input placeholder={'Phone'}/>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {required: true, message: formMessages.required},
                ],
              })(
                <Input type='password' placeholder={'Password'}/>
              )}
            </Form.Item>
          </section>
          <section>
            <h1 className={s.header}>
              Birthday
            </h1>
            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Form.Item>
                  {getFieldDecorator('month', {
                    initialValue: individualDetails ? individualDetails.month : undefined,
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Select placeholder={'Month'}>
                      {moment.months().map((month, i) =>
                        <Select.Option key={month} value={i + 1}>{month}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item>
                  {getFieldDecorator('date', {
                    initialValue: individualDetails && individualDetails.date,
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'Date'}/>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item>
                  {getFieldDecorator('year', {
                    initialValue: individualDetails && individualDetails.year,
                    rules: [
                      {required: true, message: formMessages.required},
                    ],
                  })(
                    <Input placeholder={'Year'}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </section>
        </div>
        <div className={s.actions}>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button htmlType='submit' type='primary' className={s.submitBtn}>
            Submit
          </Button>
        </div>
      </Form>
    )
  }
}

const mapState = state => ({
  individualDetails: state.register.individualDetails,
})

const mapDispatch = {
  setIndividualDetails,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register2)))
