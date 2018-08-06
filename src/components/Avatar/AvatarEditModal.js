import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import {injectIntl} from 'react-intl'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AvatarEditModal.css'
import {Button, Input} from 'antd'

class AvatarEditModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      newUrl: '',
      zoom: 1,
    }
  }

  componentDidMount() {
    if (this.props.url) {
      this.setState({newUrl: this.props.url})
    }
  }

  onClickSave = () => {
    if(this.props.url !== this.state.newUrl) {
      const canvas = this.editorRef.getImage().toBlob((blob) => {
        this.props.uploadAvatar(blob)
      })
    }
    this.props.toggleEditAavatarModal()
  }

  setUrl = (e) => {
    const fr = new FileReader()
    fr.onload = (event) => {
      this.setState({newUrl: event.target.result})
    }
    fr.readAsDataURL(e.target.files[0])

  }

  setZoom = (e) => {
    this.setState({zoom: e.target.value})
  }

  setEditorRef = (editorRef) => this.editorRef = editorRef

  render() {
    return (
      <div className={s.avatarEditWrapper}>
        <div>
          <AvatarEditor
            className={s.avatarEditorContainer}
            ref={this.setEditorRef}
            width={110}
            height={110}
            border={50}
            borderRadius={110}
            scale={parseFloat(this.state.zoom)}
            rotate={0}
            image={this.state.newUrl}
          />
          <div className={s.modalContainer}>
            <span>zoom</span>
            <Input name='zoom' type='range' min='0.1' max='2' step='0.1' onChange={this.setZoom}/>
          </div>
          <div className={s.modalContainer}>
            <Button type='primary' ghost>
              <label>
                Load image
                <input className={s.fileInput} type='file' onChange={this.setUrl}/>
              </label>
            </Button>
            <Button type='primary' onClick={this.onClickSave}>Save</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(withStyles(s)(AvatarEditModal))
