import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import {injectIntl} from 'react-intl'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AvatarEditModal.css'
import {Button, Input, Upload} from 'antd'

class AvatarEditModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      newUrl: '',
      zoom: 1,
      fileName: '',
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
        this.props.uploadAvatar(this.blobToFile(blob, this.state.fileName))
      })
    }
    this.props.toggleEditAavatarModal()
  }

  setFile = (file) => {
    const fr = new FileReader()
    fr.onload = (e) => {
      this.setState({newUrl: e.target.result, fileName: file.name})
    }
    fr.readAsDataURL(file)
  }

  blobToFile = (theBlob, fileName) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
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
            <Upload
              className={s.importBtnWrapper}
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
      </div>
    )
  }
}

export default injectIntl(withStyles(s)(AvatarEditModal))
