import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Form, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register3.css'
import ArrowIcon from '../../static/decor_arrow.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'
import {setTeamDetails} from '../../reducers/register'

class Register3 extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.setTeamDetails(values)
      }
    })
  }

  render() {
    const {teamDetails} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={s.container}>
        <div className={s.content}>
          <h1 className={s.header}>
          <span className={s.headerPrefix}>
            3
            <ArrowIcon className={s.arrowIcon}/>
          </span>
            Team Details
          </h1>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Form.Item>
                {getFieldDecorator('first_name', {
                  initialValue: teamDetails && teamDetails.first_name,
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
                  initialValue: teamDetails && teamDetails.last_name,
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
            {getFieldDecorator('role', {
              initialValue: teamDetails && teamDetails.role,
              rules: [
                {required: true, message: formMessages.required},
              ],
            })(
              <Input placeholder={'Your Role'}/>
            )}
          </Form.Item>
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
  teamDetails: state.register.teamDetails,
})

const mapDispatch = {
  setTeamDetails,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Register3)))
