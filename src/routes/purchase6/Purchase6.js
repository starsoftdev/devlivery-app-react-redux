import React from 'react'
import {connect} from 'react-redux'
import {getMessageTemplate, submitCardDetails, setFontFamilies} from '../../reducers/purchase'
import {Button, Form, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase6.css'
import {PurchaseActions, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import EditorIcon from '../../static/editor_icon.svg'
import {loadFont} from '../../utils'
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

const GLOBAL_STYLES = `
<style type='text/css'>
  body {
    margin: 0;
    padding: 5px 10px;
    line-height: 1;
  }
  p {
    margin: 0.5rem 0;
    word-break: break-all;
  }
  span {
    word-break: break-all;
  }
</style>`

// TODO use intl for custom pickers
// TODO use classNames instead of inline styles on Select fields
class FontSizePicker extends React.Component {
  state ={
    fontSize: Contants.FONT_SIZES[0]
  }
  toggleFontSize = (fontSize) => {
    this.setState({fontSize});
    this.props.execCommand('FontSize',false,`${fontSize}px`);
  }

  render() {
    return (
      <Select
        style={{width: '50%', paddingLeft: '5%', marginBottom: 20}}
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
  state ={
    fontFamily:Contants.FONTS[0]
  }

  toggleFontFamily = (fontFamily) => {
    this.setState({fontFamily});
    this.props.execCommand("FontName",false,fontFamily);
  }

  render() {
    return (
      <Select
        style={{width: '100%', marginBottom: 20, fontFamily: this.state.fontFamily}}
        placeholder={'Font Family'}
        onSelect={this.toggleFontFamily}
        value={this.state.fontFamily}
      >
        {Contants.FONTS.map((item) =>
          <Select.Option key={item} value={item} style={{fontFamily: item}}>{item}</Select.Option>
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
      <div className={s.colors}>
        {Contants.COLORS.map((item) =>
          <div key={item} className={s.colorWrapper}>
            <a
              className={s.color}
              style={{backgroundColor: item}}
              onClick={() => this.toggleColor(item)}
            />
          </div>
        )}
      </div>
    )
  }
}

class TextAlignmentPicker extends React.Component {
  state ={
    textAlignment:Contants.TEXT_ALIGNMENT[0].value
  }
  toggleTextAlignment = (textAlignment) => {
    this.setState({textAlignment});
    this.props.execCommand(textAlignment,false,true);
  }

  render() {
    return (
      <Select
        defaultValue={Contants.TEXT_ALIGNMENT[0].value}
        style={{width: '100%', marginBottom: 20}}
        placeholder={'Text Align'}
        onSelect={this.toggleTextAlignment}
        value ={this.state.textAlignment}
      >
        {Contants.TEXT_ALIGNMENT.map((item) =>
          <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
        )}
      </Select>
    )
  }
}

class FontWeightPicker extends React.Component {
  state = {
    font_weight: Contants.FONT_WEIGHT[0]
  }
  toggleFontWeight = (font_weight) => {
    // TODO workaround for toggling "bold" icon in editor - there is no option "normal"
    this.setState({font_weight});
    this.props.execCommand('Bold',false,font_weight === Contants.FONT_WEIGHT[0] ? false:true )
  }

  render() {
    return (
      <Select
        defaultValue={Contants.FONT_WEIGHT[0]}
        style={{width: '50%', paddingRight: '5%', marginBottom: 20}}
        placeholder={'Font Weight'}
        onSelect={this.toggleFontWeight}
        value={this.state.font_weight}
      >
        {Contants.FONT_WEIGHT.map((item) =>
          <Select.Option key={item} value={item}>{item}</Select.Option>
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
    const {templates} = this.props
    return (
      <Select
        style={{width: '100%', marginBottom: 20, position: 'absolute', top: 0}}
        placeholder={'Recipient name'}
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
      content: '',
      fontlink:[]
    }

    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.execTinyCommand = this.execTinyCommand.bind(this);
    this.insertConent = this.insertConent.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps && nextProps.cardDetails)
    {
      this.setState({content:nextProps.cardDetails.body});
    }
  }
  componentDidMount() {
    this.props.getMessageTemplate()
    // load all fonts to show them on Select
    Contants.FONTS.forEach(font => loadFont(font))

    const {cardDetails} = this.props
    // load editor only on client side (not server side)
    const newState = {
      mounted: true
    }
    
    this.state.fontlink = Contants.FONTS.map(font =>
      `//fonts.googleapis.com/css?family=${font}`
    )
    this.setState(newState)
  }

  handleSubmit = () => {
    this.props.submitCardDetails({body: this.tinymce.editor.getContent()})
  }
  handleEditorChange(content) {
    this.setState({ content });
  }
  execTinyCommand(type,flag,value){
    if(this.tinymce)
      this.tinymce.editor.editorCommands.execCommand(type, flag, value);
  }
  insertConent(value){
    if(this.tinymce)
      this.tinymce.editor.insertContent(value);
  }
  render() {
    const {mounted} = this.state
    const {intl, flowIndex, cardSize, templates} = this.props

    const cardWidth = cardSize ? cardSize.width : 100
    const cardHeight = cardSize ? cardSize.height : 100

    return (
      <div className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <div className={s.editorContainer}>
            <div className={s.editorWrapper}>
              <div className={s.editorIconWrapper} style={{left: `${(cardWidth/2) + 3}mm`}}>
                <EditorIcon/>
              </div>
              <div>
                {mounted && (
                  <Editor
                    ref ={editor => this.tinymce = editor} 
                    value={this.state.content} 
                    init={{
                      toolbar: false,
                      menubar:false,
                      statusbar: false,
                      width: `${cardWidth}mm`,
                      height: `${cardHeight}mm`,
                      content_css : [...this.state.fontlink, '/styles/tinymce.css'],
                    }}
                    onEditorChange={this.handleEditorChange} 
                  />
                )}
              </div>
              <div className={s.editorActions}>
                <Template templates={templates} execCommand={this.insertConent}/>
                <FontFamilyPicker execCommand={this.execTinyCommand}/>
                <FontWeightPicker execCommand={this.execTinyCommand}/>
                <FontSizePicker execCommand={this.execTinyCommand}/>
                <TextAlignmentPicker execCommand={this.execTinyCommand}/>
                <ColorPicker execCommand={this.execTinyCommand}/> 
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
            onClick={this.handleSubmit}
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
  cardSize: state.purchase.cardSize,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  templates: state.purchase.templates,
  fontFamilies: state.purchase.fontFamilies,
})

const mapDispatch = {
  getMessageTemplate,
  submitCardDetails,
  setFontFamilies,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Purchase6)))
