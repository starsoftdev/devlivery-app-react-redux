import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Card.css'
import CheckIcon from '../../static/card_checkmark.svg'
import cn from 'classnames'
import KeyHandler, {KEYPRESS} from 'react-key-handler'

class Card extends React.Component {
  render() {
    const {title, image, active, onClick, keyValue, className, svg, extra} = this.props
    return (
      <div className={cn(s.card, active && s.active, extra && s.withExtra, className)} onClick={onClick}>
        {extra && <span className={s.extra}>{extra}</span>}
        {active && <CheckIcon className={s.checkIcon}/>}
        {image && <img src={image} className={s.image}/>}
        {svg && React.createElement(svg, {className: s.icon})}
        <h3 className={s.header}>
          {keyValue && (
            <React.Fragment>
              <span className={s.key}>{keyValue}</span>
              <KeyHandler keyEventName={KEYPRESS} keyValue={keyValue} onKeyHandle={onClick}/>
            </React.Fragment>
          )}
          {title && <span className={s.title}>{title}</span>}
        </h3>
      </div>
    )
  }
}

export default withStyles(s)(Card)
