import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Actions.css'

class Actions extends React.Component {
  render() {
    const {children} = this.props
    return (
      <div className={s.actions}>
        {children}
      </div>
    )
  }
}

export default withStyles(s)(Actions)
