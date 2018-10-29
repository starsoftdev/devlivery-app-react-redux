import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Card.css'
import CheckIcon from '../../static/card_checkmark.svg'
import cn from 'classnames'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {getItemImage} from '../../utils'
import {EMPTY_IMAGE} from '../../constants'


class Card extends React.Component {
  static defaultProps = {
    bordered: true,
  }

  render() {
    const {title,subtitle, active, onClick, keyValue, className, svg, extra, description, bordered, disabled, imagesProp, item, imageStyle} = this.props
    const itemImg = getItemImage(item, imagesProp);
    const image = itemImg === EMPTY_IMAGE && svg ? null : itemImg
    const isSvg = image && image.includes('.svg')
    return (
      <div
        className={cn(
          s.card,
          active && s.active,
          extra && s.withExtra,
          bordered && s.bordered,
          disabled && s.disabled,
          className
        )}
        {...!disabled ? {onClick} : {}}
      >
        {extra && <span className={s.extra}>{extra}</span>}
        {active && <CheckIcon className={s.checkIcon}/>}
        <div className={cn(s.content, s.svgImage)} style={{alignItems: (isSvg || svg) ? 'flex-end': 'center'}}>
          {image ?
            isSvg ? (
              <img src={image} className={s.svgView}/>
            ) : (
              <div className={s.image} style={{backgroundImage: `url(${image})`,...imageStyle}}/>
            )
            : null}
          {svg && React.createElement(svg)}
          {description && <div className={s.description}>{description}</div>}
        </div>
        {title && (
          <h3 className={s.header}>
            {keyValue && (
              <React.Fragment>
                <span className={s.key}>{keyValue}</span>
                {!disabled && (
                  <KeyHandler keyEventName={KEYPRESS} keyValue={keyValue} onKeyHandle={onClick}/>
                )}
              </React.Fragment>
            )}
            <span className={s.title}>{title}</span>
            {
              subtitle &&
              <span className={s.title}>{subtitle}</span>
            }
          </h3>
        )}
      </div>
    )
  }
}

export default withStyles(s)(Card)
