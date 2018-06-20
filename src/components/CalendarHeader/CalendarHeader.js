import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './CalendarHeader.css'
import RightArrowIcon from '../../static/right-arrow.svg'
import LeftArrowIcon from '../../static/left-arrow.svg'
import moment from 'moment'

const NEXT = 1
const PREV = -1

class CalendarHeader extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onValueChange: PropTypes.func,
  }

  static defaultProps = {
    value: moment(),
    onValueChange: () => {
    },
  }


  goMonth(direction) {
    const next = this.props.value.clone()
    next.add(direction, 'months')
    this.props.onValueChange(next)
  }

  render() {
    const {value} = this.props
    return (
      <div className={s.header}>
        <a
          className={s.prevBtn}
          onClick={() => this.goMonth(PREV)}
        >
          <LeftArrowIcon className={s.icon}/>
        </a>
        <span className={s.date}>{value.format('MMMM YYYY')}</span>
        <a
          className={s.nextBtn}
          onClick={() => this.goMonth(NEXT)}
        >
          <RightArrowIcon className={s.icon}/>
        </a>
      </div>
    )
  }
}

export default withStyles(s)(CalendarHeader)
