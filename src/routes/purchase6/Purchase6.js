import React from 'react'
import {connect} from 'react-redux'
import {submitCardDetails} from '../../reducers/purchase'
import {Button, Col, Form, Layout, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase6.css'
import {Actions, Header, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import cn from 'classnames'
import Preview from './Preview'
import messages from './messages'
import {ContentState, EditorState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'
import draftWysiwygStyles from 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import createStyles from 'draft-js-custom-styles'
import {stateToHTML} from 'draft-js-export-html'

const {styles, customStyleFn, exporter} = createStyles(['font-size', 'color', 'font-family', 'font-weight'])

// TODO refactor code
// TODO move font sizes/colors/etc to constants
class Purchase6 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      previewCollapsed: false,
      loaded: false,
    }

    this.updateEditorState = (editorState) => this.setState({editorState})
  }

  componentDidMount() {
    const {cardDetails} = this.props
    const newState = {
      loaded: true
    }
    const html = cardDetails ? cardDetails.body : ''
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      newState.editorState = EditorState.createWithContent(contentState)
    }
    this.setState(newState)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {editorState} = this.state
        const inlineStyles = exporter(editorState)
        const body = stateToHTML(editorState.getCurrentContent(), {inlineStyles})
        this.props.submitCardDetails({...values, body})
      }
    })
  }

  onPreviewCollapse = (previewCollapsed) => {
    this.setState({previewCollapsed})
  }

  toggleFontSize = (fontSize) => {
    const newEditorState = styles.fontSize.toggle(this.state.editorState, fontSize)

    return this.updateEditorState(newEditorState)
  }

  toggleColor = color => {
    const newEditorState = styles.color.toggle(this.state.editorState, color)

    return this.updateEditorState(newEditorState)
  }

  toggleFontFamily = (fontFamily) => {
    const newEditorState = styles.fontFamily.toggle(this.state.editorState, fontFamily)

    return this.updateEditorState(newEditorState)
  }


  toggleFontWeight = (fontWeight) => {
    const newEditorState = styles.fontWeight.toggle(this.state.editorState, fontWeight)

    return this.updateEditorState(newEditorState)
  }

  render() {
    const {previewCollapsed, editorState, loaded} = this.state
    const {cardDetails, intl, flowIndex, cardSize} = this.props
    const {getFieldDecorator} = this.props.form
    const inlineStyles = exporter(editorState)
    const html = stateToHTML(editorState.getCurrentContent(), {inlineStyles})

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
            <Header className={s.layoutHeader}/>
            <div className={s.content}>
              <SectionHeader
                header={intl.formatMessage(messages.header)}
                number={flowIndex + 1}
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
                      <Select
                        placeholder={intl.formatMessage(messages.fontWeight)}
                        onChange={this.toggleFontWeight}
                      >
                        {['normal', 'bold'].map((item) =>
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
                      <Select
                        placeholder={intl.formatMessage(messages.color)}
                        onChange={this.toggleColor}
                      >
                        {['green', 'blue', 'red', 'purple', 'orange'].map((item) =>
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
                      <Select
                        placeholder={intl.formatMessage(messages.fontFamily)}
                        onChange={this.toggleFontFamily}
                      >
                        {['Arial', 'Georgia', 'Impact', 'Tahoma', 'Verdana'].map((item) =>
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
                      <Select
                        placeholder={intl.formatMessage(messages.size)}
                        onChange={this.toggleFontSize}
                      >
                        {['12px', '24px', '36px', '50px', '72px'].map((item) =>
                          <Select.Option key={item} value={item}>{item}</Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {loaded && (
                <Editor
                  toolbarHidden
                  customStyleFn={customStyleFn}
                  editorClassName={s.editor}
                  editorState={editorState}
                  onEditorStateChange={this.updateEditorState}
                />
              )}
            </div>
          </Layout.Content>
          <Preview
            onCollapse={this.onPreviewCollapse}
            collapsed={previewCollapsed}
            content={html}
            cardSize={cardSize}
          />
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
  cardSize: state.purchase.cardSize,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  submitCardDetails,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(draftWysiwygStyles, s)(Purchase6)))
