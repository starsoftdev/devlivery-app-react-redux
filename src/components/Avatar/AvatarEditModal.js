import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import {injectIntl} from 'react-intl'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AvatarEditModal.css'
import {Button, Input, Upload, message} from 'antd'
import {FloatingLabel} from '../../components';

class AvatarEditModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newUrl: props.url,
      zoom: 1,
      fileName: '',
    }
  }

  onClickSave = () => {
    if (this.props.url !== this.state.newUrl) {
      this.editorRef.getImage().toBlob((blob) => {
        const lessThanMaxSize = blob.size / 1024 / 1024 < 2
        if(lessThanMaxSize) {
          this.props.uploadAvatar(new File([blob], this.state.fileName))
          this.props.toggleEditAvatarModal()
        } else {
          message.error('picture is too big. Need to reduce zoom')
        }
      })
    }
  }

  setFile = (file) => {
    const lessThanMaxSize = file.size / 1024 / 1024 < 2
    if (!lessThanMaxSize) {
      // TODO move to translations
      message.error('The image may not be greater than 2048 kilobytes.')
    }
    const fr = new FileReader()
    fr.onload = (e) => {
      this.setState({newUrl: e.target.result, fileName: file.name})
    }
    fr.readAsDataURL(file)
  }

  setZoom = (e) => {
    this.setState({zoom: e.target.value})
  }

  setEditorRef = (editorRef) => this.editorRef = editorRef

  render() {
    return (
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
          <Upload
            accept='image/*'
            beforeUpload={(file) => {
              this.setFile(file)
              return false
            }}
            fileList={[]}
          >
            <Button type='primary' ghost>
              <label className={s.loadImageBtn}>
                Load image
              </label>
            </Button>
          </Upload>

          <Button type='primary' onClick={this.onClickSave}>Save</Button>
        </div>
      </div>
    )
  }
}

export default injectIntl(withStyles(s)(AvatarEditModal))
