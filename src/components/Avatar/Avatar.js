import React from 'react'
import NoAvatarIcon from '../../static/individual.svg'
import EditIcon from '../../static/edit.svg'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Avatar.css'
import {Modal} from 'antd'
import AvatarEditModal from './AvatarEditModal'
import {connect} from 'react-redux'
import {uploadAvatar} from '../../reducers/user'

class Avatar extends React.Component {
  state = {
    editAvatarModalOpened: false,
  }

  toggleEditAvatarModal = () => {
    this.setState({editAvatarModalOpened: !this.state.editAvatarModalOpened})
  }

  render() {
    const {editAvatarModalOpened} = this.state
    const {user} = this.props

    return (
      <React.Fragment>
        <Modal
          title='Edit avatar'
          visible={editAvatarModalOpened}
          onOk={this.handleOk}
          onCancel={this.toggleEditAvatarModal}
          footer={null}
        >
          <AvatarEditModal
            uploadAvatar={this.props.uploadAvatar}
            url={user && user.avatar && user.avatar.url}
            toggleEditAvatarModal={this.toggleEditAvatarModal}
          />
        </Modal>
        <div className={s.avatarContainer} onClick={this.toggleEditAvatarModal}>
          <div className={s.avatarWrapper}>
            <EditIcon className={s.editBtn}/>
            {user && user.avatar ? <img src={user.avatar.url} width='110'/> : <NoAvatarIcon/>}
          </div>
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
}

export default connect(mapState, mapDispatch)(withStyles(s)(Avatar))
