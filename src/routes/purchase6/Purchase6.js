import React from 'react'
import { connect } from 'react-redux'
import { getMessageTemplate, submitCardDetails, setFontFamilies } from '../../reducers/purchase'
import { Button, Form, Select } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase6.css'
import { PurchaseActions, SectionHeader } from '../../components'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import messages from './messages'
import EditorIcon from '../../static/editor_icon.svg'
import { loadFont } from '../../utils'
import * as Contants from '../../constants';

import { Editor } from '@tinymce/tinymce-react';
// TODO move font sizes/colors/etc to constants
import { injectGlobal } from 'styled-components';

injectGlobal`
  .mce-notification-warning{
    display: none !important;
  }
  iframe {overflow:hidden;}
  .mceContentBody{
    overflow-y:hidden !important;
  }
`
const GLOBAL_META = `
<meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    `;
const GLOBAL_STYLES = `
<style type='text/css'>
  body {
    line-height: 1.3;
    font-size: 16px;
    font-family:'Anonymous Pro'
  }
  p {
    word-break: break-all;
    font-family:'Anonymous Pro'
  }
  span {
    word-break: break-all;
    font-family:'Anonymous Pro'
  }
</style>`

// TODO use intl for custom pickers
// TODO use classNames instead of inline styles on Select fields
class FontSizePicker extends React.Component {
  state = {
    fontSize: Contants.FONT_SIZES[0]
  }
  toggleFontSize = (fontSize) => {
    this.setState({ fontSize });
    this.props.execCommand('FontSize', false, `${fontSize}px`);
  }

  render() {
    return (
      <Select
        style={{ width: '50%', paddingLeft: '5%', marginBottom: 20 }}
        placeholder={'Font Size'}
        onSelect={this.toggleFontSize}
        value={this.state.fontSize}
      >
        {Contants.FONT_SIZES.map((item) =>
          <Select.Option key={item} value={item}>{`${item}px`}</Select.Option>
        )}
      </Select>
    )
  }
}

class FontFamilyPicker extends React.Component {
  state = {
    fontFamily: Contants.FONTS[0]
  }
  componentDidMount() {
    this.props.setFontFamilies(Contants.FONTS[0])
  }

  toggleFontFamily = (fontFamily) => {
    this.setState({ fontFamily });
    this.props.setFontFamilies(fontFamily)
    this.props.execCommand("FontName", false, fontFamily);
  }

  render() {
    return (
      <Select
        style={{ width: '100%', marginBottom: 20, fontFamily: this.state.fontFamily, top: -70 }}
        placeholder={'Font Family'}
        onSelect={this.toggleFontFamily}
        value={this.state.fontFamily}
      >
        {Contants.FONTS.map((item) =>
          <Select.Option key={item} value={item} style={{ fontFamily: item }}>{item}</Select.Option>
        )}
      </Select>
    )
  }
}

const ConnectedFontFamilyPicker = connect(null, {
  setFontFamilies,
})(FontFamilyPicker)

class ColorPicker extends React.Component {
  toggleColor = (color) => {
    //this.props.onChange('color', color)
    this.props.execCommand('ForeColor', false, color);
  }

  render() {
    return (
      <div className={this.props.isLargeCard===true? s.colors_land : s.colors}>
        {Contants.COLORS.map((item) =>
          <div key={item} className={s.colorWrapper}>
            <a
              className={s.color}
              style={{ backgroundColor: item }}
              onClick={() => this.toggleColor(item)}
            />
          </div>
        )}
      </div>
    )
  }
}

class TextAlignmentPicker extends React.Component {
  state = {
    textAlignment: Contants.TEXT_ALIGNMENT[0].value
  }
  toggleTextAlignment = (textAlignment) => {
    this.setState({ textAlignment });
    this.props.execCommand(textAlignment, false, true);
  }

  render() {
    return (
      <Select
        defaultValue={Contants.TEXT_ALIGNMENT[0].value}
        style={{ width: '100%', marginBottom: 20 }}
        placeholder={'Text Align'}
        onSelect={this.toggleTextAlignment}
        value={this.state.textAlignment}
      >
        {Contants.TEXT_ALIGNMENT.map((item) =>
          <Select.Option key={item.value} value={item.value}>{this.props.intl.locale === 'de-DE' ? item.label_de : item.label}</Select.Option>
        )}
      </Select>
    )
  }
}

class FontWeightPicker extends React.Component {
  state = {
    font_weight: Contants.FONT_WEIGHT[0].value
  }
  toggleFontWeight = (font_weight) => {
    // TODO workaround for toggling "bold" icon in editor - there is no option "normal"
    this.setState({ font_weight });
    this.props.execCommand('Bold', false, font_weight === Contants.FONT_WEIGHT[0].value ? false : true)
  }

  render() {
    return (
      <Select
        defaultValue={Contants.FONT_WEIGHT[0].value}
        style={{ width: '50%', paddingRight: '5%', marginBottom: 20 }}
        placeholder={'Font Weight'}
        onSelect={this.toggleFontWeight}
        value={this.state.font_weight}
      >
        {Contants.FONT_WEIGHT.map((item) =>
          <Select.Option key={item.value} value={item.value}>{this.props.intl.locale === 'de-DE' ? item.label_de : item.label}</Select.Option>
        )}
      </Select>
    )
  }
}

class Template extends React.Component {
  addTemplate = (value) => {
    this.props.execCommand(value);
  }

  render() {
    const { templates } = this.props
    return (
      <Select
        style={{ width: '100%', marginBottom: 20, position: 'absolute', top: 0 }}
        placeholder={this.props.intl.formatMessage(messages.recipient)}
        onSelect={this.addTemplate}
      >
        {templates && templates.map((item) =>
          <Select.Option key={item.name} value={item.template}>{item.name}</Select.Option>
        )}
      </Select>
    )
  }
}

// TODO refactor code
class Purchase6 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mounted: false,
      content: props.cardDetails ? props.cardDetails.body:'',
      fontlink: []
    }

    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.execTinyCommand = this.execTinyCommand.bind(this);
    this.insertConent = this.insertConent.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.cardDetails && nextProps.cardDetails !== this.props.cardDetails) {
      this.setState({ content: nextProps.cardDetails.body });
    }
  }
  componentDidMount() {
    this.props.getMessageTemplate()
    // load all fonts to show them on Select
    Contants.FONTS.forEach(font => loadFont(font))

    const { cardDetails } = this.props
    // load editor only on client side (not server side)
    const newState = {
      mounted: true
    }

    this.state.fontlink = Contants.FONTS.map(font =>
      `//fonts.googleapis.com/css?family=${font}`
    )
    this.setState(newState)
  }
  componentWillUnmount(){
    this.handleSubmit(true);
  }
  handleSubmit = (stayPage) => {
    
    const html = this.tinymce && this.tinymce.editor && this.tinymce.editor.getContent();
    var fonts = this.props.fontFamilies.map(font =>
      `<link id="${font}" rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=${font}" media="all">`
    ).join('')
    if (this.props.fontFamilies.length <= 0)
      fonts = `<link id="${Contants.FONTS[0]}" rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=${Contants.FONTS[0]}" media="all">`
    const body = `<!doctype html><html lang="en"><head>${GLOBAL_META}${fonts}${GLOBAL_STYLES}</head><body><span><span/>${html && html !== undefined? html:''}</body></html>`;
    console.log('html',html);
    this.props.submitCardDetails({ body },stayPage)
  }
  handleEditorChange(content) {
    this.setState({ content });
  }
  execTinyCommand(type, flag, value) {
    if (this.tinymce)
      this.tinymce.editor.editorCommands.execCommand(type, flag, value);
  }
  insertConent(value) {
    if (this.tinymce)
      this.tinymce.editor.insertContent(value);
  }
  render() {
    const { mounted } = this.state
    const { intl, flowIndex, cardSizeKey, templates, orientation } = this.props

    const cardSize = Contants.CARD_SIZES(intl).find(item => item.key === cardSizeKey);

    const w = cardSize ? cardSize.width : 100
    const h = cardSize ? cardSize.height : 100

    const cardWidth = orientation && orientation == 'l' || cardSizeKey === '4" X 9"'? Math.max(h,w): Math.min(h,w);
    const cardHeight = orientation && orientation == 'l' || cardSizeKey === '4" X 9"'? Math.min(h,w): Math.max(h,w);

    const isLargeCard = cardWidth > 182 || cardSizeKey === '4" X 9"'? true : false;
    
    return (
      <div className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <div className={isLargeCard===true ? s.editorContainer_land : s.editorContainer}>
            <div className={isLargeCard===true ? s.editorContent_land : s.editorContent}>
              <div className={s.editorIconWrapper}>
                <EditorIcon />
              </div>
              <div className={s.editorWrapper}>
                {mounted && (
                  <Editor
                    ref={editor => this.tinymce = editor}
                    value={this.state.content && this.state.content.replace('<!doctype html>', '')}
                    init={{
                      toolbar: false,
                      menubar: false,
                      statusbar: false,
                      width: `${cardWidth}mm`,
                      height: `${cardHeight}mm`,
                      content_css: [...this.state.fontlink, '/styles/tinymce.css'],
                      setup: function (ed) {
                        ed.on('init', function (e) {
                          ed.execCommand("fontName", false, Contants.FONTS[0]);
                        });
                      }
                    }}
                    onEditorChange={this.handleEditorChange}
                  />
                )}
              </div>
            </div>
            <div className={isLargeCard===true ? s.editorActions_land : s.editorActions}>
              <div className={s.toolpanel}>
                <Template templates={templates} execCommand={this.insertConent} intl={intl} />
                <ConnectedFontFamilyPicker execCommand={this.execTinyCommand} />
                <FontWeightPicker execCommand={this.execTinyCommand} intl={intl} />
                <FontSizePicker execCommand={this.execTinyCommand} />
                <TextAlignmentPicker execCommand={this.execTinyCommand} intl={intl} />
              </div>
              <div className={isLargeCard===true? s.colorpanel_land: s.colorpanel}>
                <ColorPicker execCommand={this.execTinyCommand} isLargeCard = {isLargeCard}/>
              </div>
            </div>
          </div>
        </div>
        <PurchaseActions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={()=>this.handleSubmit(false)}
          />
          <Button
            type='primary'
            onClick={()=>this.handleSubmit(false)}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
      </div>
    )
  }
}

const mapState = state => ({
  cardDetails: state.purchase.cardDetails,
  cardSizeKey: state.purchase.cardSizeKey,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  templates: state.purchase.templates,
  fontFamilies: state.purchase.fontFamilies,
  orientation: state.purchase.orientation
})

const mapDispatch = {
  getMessageTemplate,
  submitCardDetails,
  setFontFamilies,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Purchase6)))
