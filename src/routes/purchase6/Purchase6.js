import React from 'react'
import {connect} from 'react-redux'
import {submitCardDetails} from '../../reducers/purchase'
import {Button, Col, Form, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase6.css'
import {PurchaseActions, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import {ContentState, EditorState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'
import draftWysiwygStyles from '../../styles/react-draft-wysiwyg.css'
import createStyles from 'draft-js-custom-styles'
import {stateToHTML} from 'draft-js-export-html'
import EditorIcon from '../../static/editor_icon.svg'
import {loadFont} from '../../utils'

// TODO make text-alignment work
const {styles, customStyleFn, exporter} = createStyles(['font-size', 'color', 'font-family', 'font-weight', 'text-alignment'])

const FONTS = ['Amatic SC', 'Anonymous Pro', 'Caveat', 'Cinzel', 'Covered By Your Grace', 'Cutive Mono', 'Dancing Script', 'Gloria Hallelujah', 'Great Vibes', 'Italianno', 'Josefin Sans', 'Merienda', 'Montserrat', 'Nova Mono', 'Open Sans', 'PT Serif', 'Playfair Display', 'Playfair Display SC', 'Raleway', 'Sacramento', 'Shadows Into Light', 'Teko', 'Yellowtail']

// TODO refactor code
// TODO move font sizes/colors/etc to constants
class Purchase6 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      mounted: false,
    }

    this.updateEditorState = (editorState) => this.setState({editorState})
  }

  componentDidMount() {
    const {cardDetails} = this.props
    // load editorRef only on client side (not server side)
    const newState = {
      mounted: true
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
    loadFont(fontFamily)
    return this.updateEditorState(newEditorState)
  }


  toggleFontWeight = (fontWeight) => {
    const newEditorState = styles.fontWeight.toggle(this.state.editorState, fontWeight)

    return this.updateEditorState(newEditorState)
  }


  toggleTextAlignment = (textAlignment) => {
    const newEditorState = styles.textAlignment.toggle(this.state.editorState, textAlignment)

    return this.updateEditorState(newEditorState)
  }

  render() {
    const {editorState, mounted} = this.state
    const {cardDetails, intl, flowIndex, cardSize} = this.props
    const {getFieldDecorator} = this.props.form

    return (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <div className={s.editorContainer}>
            <div className={s.editorWrapper}>
              <div className={s.editorIconWrapper}>
                <EditorIcon/>
              </div>
              <div
                style={{
                  width: `${cardSize ? cardSize.width : 100}mm`,
                  height: `${cardSize ? cardSize.height : 100}mm`,
                }}
              >
                {mounted && (
                  <Editor
                    wrapperClassName={s.editor}
                    toolbarHidden
                    customStyleFn={customStyleFn}
                    editorClassName={s.editorBody}
                    editorState={editorState}
                    onEditorStateChange={this.updateEditorState}
                  />
                )}
              </div>
            </div>
            <div className={s.editorActions}>
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
              <Form.Item>
                {getFieldDecorator('font_family', {
                  initialValue: cardDetails ? cardDetails.font_family : undefined,
                })(
                  <Select
                    placeholder={intl.formatMessage(messages.fontFamily)}
                    onChange={this.toggleFontFamily}
                  >
                    {FONTS.map((item) =>
                      <Select.Option key={item} value={item}>{item}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
              <Row gutter={20}>
                <Col xs={24} sm={12}>
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
                <Col xs={24} sm={12}>
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
              <Form.Item>
                {getFieldDecorator('text_alignment', {
                  initialValue: cardDetails ? cardDetails.text_alignment : undefined,
                })(
                  <Select
                    placeholder={intl.formatMessage(messages.textAlignment)}
                    onChange={this.toggleTextAlignment}
                  >
                    {[
                      {
                        value: 'left', label: 'Text align left',
                      },
                      {
                        value: 'center', label: 'Text align center',
                      },
                      {
                        value: 'right', label: 'Text align right',
                      },
                    ].map((item) =>
                      <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
              <div className={s.colors}>
                {[
                  '#BF2828',
                  '#F5A623',
                  '#F8E71C',
                  '#8B572A',
                  '#50E3C2',
                  '#B8E986',
                  '#000000',
                  '#4A4A4A',
                  '#9B9B9B',
                  '#4A90E2',
                  '#BD10E0',
                  '#9013FE',
                  '#4E7321',
                  '#E0DFE5',
                  '#845932',
                  '#4A4A3A',
                ].map((item) =>
                  <div key={item} className={s.colorWrapper}>
                    <a
                      className={s.color}
                      style={{backgroundColor: item}}
                      onClick={() => this.toggleColor(item)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <PurchaseActions>
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
        </PurchaseActions>
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
