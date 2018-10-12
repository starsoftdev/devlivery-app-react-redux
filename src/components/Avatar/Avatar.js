import React from 'react'
import NoAvatarIcon from '../../static/individual.svg'
import EditIcon from '../../static/edit.svg'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Avatar.css'
import { Modal } from 'antd'
import AvatarEditModal from './AvatarEditModal'
import { connect } from 'react-redux'
import { uploadAvatar, uploadLogo } from '../../reducers/user'

class Avatar extends React.Component {
  state = {
    editAvatarModalOpened: false,
  }

  toggleEditAvatarModal = () => {
    this.setState({ editAvatarModalOpened: !this.state.editAvatarModalOpened })
  }

  render() {
    const { editAvatarModalOpened } = this.state
    const { user, isLogo } = this.props
    const imageURL = isLogo ? user && user.company_logo : user && user.avatar && user.avatar.url;
    return (
      <React.Fragment>
        <Modal
          title={isLogo ? 'Edit Logo' : 'Edit avatar'}
          visible={editAvatarModalOpened}
          onOk={this.handleOk}
          onCancel={this.toggleEditAvatarModal}
          footer={null}
        >
          <AvatarEditModal
            uploadAvatar={isLogo ? this.props.uploadLogo : this.props.uploadAvatar}
            url={imageURL}
            toggleEditAvatarModal={this.toggleEditAvatarModal}
          />
        </Modal>
        <div className={s.avatarContainer} onClick={this.toggleEditAvatarModal}>
          {
            isLogo && imageURL === null ?
              <div className={s.avatarWrapper}>
                <h4>Upload logo</h4>
              </div>
              :
              <div className={s.avatarWrapper}>
                <EditIcon className={s.editBtn} />
                {imageURL ? <img src={imageURL} width={'110'} /> : <NoAvatarIcon />}
              </div>
          }
        </div>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  user: state.user.user,
})

const mapDispatch = {
  uploadAvatar,
  uploadLogo
}

export default connect(mapState, mapDispatch)(withStyles(s)(Avatar))
