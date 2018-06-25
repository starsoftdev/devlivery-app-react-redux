import React from 'react'
import {connect} from 'react-redux'
import {submitCardDetails} from '../../reducers/purchase'
import {Button, Col, Form, Input, Layout, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase6.css'
import {Actions, Link, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {HOME_ROUTE} from '../'
import Logo from '../../static/logo.svg'
import cn from 'classnames'
import Preview from './Preview'
import messages from './messages'

const TextArea = Input.TextArea

// TODO move preview to separate component
class Purchase6 extends React.Component {
  state = {
    previewCollapsed: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitCardDetails(values)
      }
    })
  }

  onPreviewCollapse = (previewCollapsed) => {
    this.setState({previewCollapsed})
  }

  render() {
    const {previewCollapsed} = this.state
    const {cardDetails, intl} = this.props
    const {getFieldDecorator} = this.props.form

    return (
      <Form onSubmit={this.handleSubmit} className={s.form}>
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
            <div className={s.layoutHeader}>
              <Link to={HOME_ROUTE}>
                <Logo/>
              </Link>
            </div>
            <div className={s.content}>
              <SectionHeader
                header={intl.formatMessage(messages.header)}
                number={6}
                prefixClassName={s.headerPrefix}
              />
              <Row gutter={20}>
                <Col xs={24} sm={12}>
                  <Form.Item>
                    {getFieldDecorator('recipient', {
                      initialValue: cardDetails ? cardDetails.recipient : undefined,
                    })(
                      <Select placeholder={intl.formatMessage(messages.recipient)}>
                        {[].map((item) =>
                          <Select.Option key={item} value={item}>{item}</Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={6}>
                  <Form.Item>
                    {getFieldDecorator('font_weight', {
                      initialValue: cardDetails ? cardDetails.font_weight : undefined,
                    })(
                      <Select placeholder={intl.formatMessage(messages.fontWeight)}>
                        {[].map((item) =>
                          <Select.Option key={item} value={item}>{item}</Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={6}>
                  <Form.Item>
                    {getFieldDecorator('color', {
                      initialValue: cardDetails ? cardDetails.color : undefined,
                    })(
                      <Select placeholder={intl.formatMessage(messages.color)}>
                        {[].map((item) =>
                          <Select.Option key={item} value={item}>{item}</Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col xs={24} sm={12}>

                </Col>
                <Col xs={24} sm={6}>
                  <Form.Item>
                    {getFieldDecorator('font_family', {
                      initialValue: cardDetails ? cardDetails.font_family : undefined,
                    })(
                      <Select placeholder={intl.formatMessage(messages.fontFamily)}>
                        {[].map((item) =>
                          <Select.Option key={item} value={item}>{item}</Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={6}>
                  <Form.Item>
                    {getFieldDecorator('size', {
                      initialValue: cardDetails ? cardDetails.size : undefined,
                    })(
                      <Select placeholder={intl.formatMessage(messages.size)}>
                        {[].map((item) =>
                          <Select.Option key={item} value={item}>{item}</Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                {getFieldDecorator('body', {
                  initialValue: cardDetails ? cardDetails.body : undefined,
                })(
                  <TextArea placeholder={intl.formatMessage(messages.body)} className={s.body} rows={7}/>
                )}
              </Form.Item>
            </div>
          </Layout.Content>
          <Preview onCollapse={this.onPreviewCollapse} collapsed={previewCollapsed}/>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button
            type='primary'
            htmlType='submit'
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </Form>
    )
  }
}

const mapState = state => ({
  cardDetails: state.purchase.cardDetails,
  loading: state.purchase.loading,
})

const mapDispatch = {
  submitCardDetails,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Purchase6)))
