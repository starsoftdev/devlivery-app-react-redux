import React from 'react'
import {connect} from 'react-redux'
import {getMessageTemplate, submitCardDetails, setFontFamilies} from '../../reducers/purchase'
import {Button, Form, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase6.css'
import {PurchaseActions, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import {ContentState, EditorState, Modifier, convertToRaw} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'
import EditorIcon from '../../static/editor_icon.svg'
import {loadFont} from '../../utils'
import draftToHtml from 'draftjs-to-html'

// TODO move font sizes/colors/etc to constants
const FONTS = ['Amatic SC', 'Anonymous Pro', 'Caveat', 'Cinzel', 'Covered By Your Grace', 'Cutive Mono', 'Dancing Script', 'Gloria Hallelujah', 'Great Vibes', 'Italianno', 'Josefin Sans', 'Merienda', 'Montserrat', 'Nova Mono', 'Open Sans', 'PT Serif', 'Playfair Display', 'Playfair Display SC', 'Raleway', 'Sacramento', 'Shadows Into Light', 'Teko', 'Yellowtail']

const COLORS = [
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
]

const FONT_WEIGHT = ['normal', 'bold']

const FONT_SIZES = ['16px', '24px', '36px', '50px', '72px']

const TEXT_ALIGNMENT = [
  {
    value: 'left', label: 'Left',
  },
  {
    value: 'center', label: 'Center',
  },
  {
    value: 'right', label: 'Right',
  },
]

const GLOBAL_STYLES = `
<style type='text/css'>
  body {
    margin: 0;
    padding: 5px 10px;
    line-height: 1;
  }
  p {
    margin: 0.5rem 0;
  }
</style>`

// TODO use intl for custom pickers
// TODO use classNames instead of inline styles on Select fields
class FontSizePicker extends React.Component {
  toggleFontSize = (fontSize) => {
    this.props.onChange(fontSize)
  }

  render() {
    return (
      <Select
        defaultValue={FONT_SIZES[0]}
        style={{width: '50%', paddingLeft: '5%', marginBottom: 20}}
        placeholder={'Font Size'}
        onChange={this.toggleFontSize}
      >
        {FONT_SIZES.map((item) =>
          <Select.Option key={item} value={item}>{item}</Select.Option>
        )}
      </Select>
    )
  }
}

class FontFamilyPicker extends React.Component {
  toggleFontFamily = (fontFamily) => {
    loadFont(fontFamily)
    this.props.onChange(fontFamily)
    this.props.setFontFamilies(fontFamily)
  }

  render() {
    return (
      <Select
        defaultValue={FONTS[10]}
        style={{width: '100%', marginBottom: 20}}
        placeholder={'Font Family'}
        onChange={this.toggleFontFamily}
      >
        {FONTS.map((item) =>
          <Select.Option key={item} value={item}>{item}</Select.Option>
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
    this.props.onChange('color', color)
  }

  render() {
    return (
      <div className={s.colors}>
        {COLORS.map((item) =>
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
  toggleTextAlignment = (textAlignment) => {
    this.props.onChange(textAlignment)
  }

  render() {
    return (
      <Select
        defaultValue={TEXT_ALIGNMENT[0].value}
        style={{width: '100%', marginBottom: 20}}
        placeholder={'Text Align'}
        onChange={this.toggleTextAlignment}
      >
        {TEXT_ALIGNMENT.map((item) =>
          <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
        )}
      </Select>
    )
  }
}

class FontWeightPicker extends React.Component {
  toggleFontWeight = (fontWeight) => {
    // TODO workaround for toggling "bold" icon in editor - there is no option "normal"
    this.props.onChange('bold')
  }

  render() {
    return (
      <Select
        defaultValue={FONT_WEIGHT[0]}
        style={{width: '50%', paddingRight: '5%', marginBottom: 20}}
        placeholder={'Font Weight'}
        onChange={this.toggleFontWeight}
      >
        {FONT_WEIGHT.map((item) =>
          <Select.Option key={item} value={item}>{item}</Select.Option>
        )}
      </Select>
    )
  }
}

class Template extends React.Component {
  addTemplate = (value) => {
    const {editorState, onChange} = this.props
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      value,
      editorState.getCurrentInlineStyle(),
    )
    onChange(EditorState.push(editorState, contentState, 'insert-characters'))
  }

  render() {
    const {templates} = this.props
    return (
      <Select
        style={{width: '100%', marginBottom: 20, position: 'absolute', top: 0}}
        placeholder={'Recipient name'}
        onChange={this.addTemplate}
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
      editorState: EditorState.createEmpty(),
      mounted: false,
    }

    this.updateEditorState = (editorState) => this.setState({editorState})
  }

  componentDidMount() {
    this.props.getMessageTemplate()

    // load default font
    loadFont(FONTS[10])
    this.props.setFontFamilies(FONTS[10])

    const {cardDetails} = this.props
    // load editor only on client side (not server side)
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

  handleSubmit = () => {
    const {editorState} = this.state
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    const fonts = this.props.fontFamilies.map(font =>
      `<link id="${font}" rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=${font}" media="all">`
    ).join('')
    this.props.submitCardDetails({body: `${GLOBAL_STYLES}${fonts}${html}`})
  }

  render() {
    const {editorState, mounted} = this.state
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
                    editorRef={(editor) => this.editor = editor}
                    wrapperClassName={s.editor}
                    editorStyle={{
                      width: `${cardWidth}mm`,
                      height: `${cardHeight}mm`,
                      fontSize: FONT_SIZES[0],
                      color: COLORS[7],
                      fontFamily: FONTS[10],
                    }}
                    toolbar={{
                      options: ['fontFamily', 'inline', 'fontSize', 'textAlign', 'colorPicker'],
                      textAlign: {
                        component: TextAlignmentPicker
                      },
                      inline: {
                        component: FontWeightPicker,
                      },
                      fontSize: {
                        component: FontSizePicker
                      },
                      fontFamily: {
                        component: ConnectedFontFamilyPicker
                      },
                      colorPicker: {
                        component: ColorPicker
                      },
                    }}
                    editorClassName={s.editorBody}
                    toolbarClassName={s.editorActions}
                    editorState={editorState}
                    onEditorStateChange={this.updateEditorState}
                    toolbarCustomButtons={[<Template templates={templates}/>]}
                  />
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
