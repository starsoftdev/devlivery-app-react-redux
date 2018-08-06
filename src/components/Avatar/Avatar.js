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
  constructor(props) {
    super(props)
    this.state = {
      showEditAvatarModal: false,
      avatar: '',
    }
  }

  componentDidMount() {
    if(this.props.user.avatar){
      this.setState({avatar: this.props.user.avatar.url})
    }
  }

  toggleEditAavatarModal = () => {
    this.setState({showEditAvatarModal: !this.state.showEditAvatarModal})
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          title="Edit avatar"
          visible={this.state.showEditAvatarModal}
          onOk={this.handleOk}
          onCancel={this.toggleEditAavatarModal}
          footer={null}
        >
          <AvatarEditModal
            uploadAvatar={this.props.uploadAvatar}
            url={this.state.avatar}
            toggleEditAavatarModal={this.toggleEditAavatarModal}
          />
        </Modal>
        <div className={s.avatarContainer} onClick={this.toggleEditAavatarModal}>
          <div className={s.avatarWrapper}>
            <EditIcon className={s.editBtn} />
            {this.state.avatar ? <img src={this.state.avatar} width='110'/> : <NoAvatarIcon />}
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
