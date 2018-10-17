import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './SectionHeader.css'
import ArrowIcon from '../../static/decor_arrow.svg'
import cn from 'classnames'

class SectionHeader extends React.Component {
  render() {
    const {header, className, number, children, prefixClassName} = this.props
    return (
      <h1 className={cn(s.headerWrapper, className)}>
        <span className={s.header}>
          {number > 0 && (
            <span className={cn(s.prefix)}>
              {number}
            </span>
          )}
          {number > 0 && (
            <ArrowIcon className={s.arrowIcon}/>
          )}
          {header}
        </span>
        {children}
      </h1>
    )
  }
}

export default withStyles(s)(SectionHeader)
