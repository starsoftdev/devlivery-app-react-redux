import React from 'react'
import {connect} from 'react-redux'
import {clear, acceptInvitation} from '../../reducers/login'

class Invitation extends React.Component {
  componentWillUnmount() {
    this.props.clear()
  }
  componentDidMount(){
    this.props.acceptInvitation(this.props.token);
  }
  render() {
    return (
      <div />
    )
  }
}

const mapState = state => ({
  ...state.login,
})

const mapDispatch = {
  clear,
  acceptInvitation
}

export default connect(mapState, mapDispatch)(Invitation)
