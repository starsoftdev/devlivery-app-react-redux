import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './CalendarEvents.css'
import {Modal} from 'antd'
import {connect} from 'react-redux'
import {closeCalendarEventsModal} from '../../reducers/orders'
import moment from 'moment'
import {DATE_FORMAT} from '../../constants'
import {CalendarEvent} from '../'

class CalendarEvents extends React.Component {
  render() {
    const {closeCalendarEventsModal, events, selectedDate} = this.props
    const dayEvents = events.filter(event => moment(event.contact_specific_date || event.occasion_date, DATE_FORMAT).isSame(selectedDate, 'd'))
    return (
      <Modal
        visible
        title={`Events on ${moment(selectedDate).format('DD MMM YYYY')}`}
        onOk={closeCalendarEventsModal}
        onCancel={closeCalendarEventsModal}
        width={500}
        footer={null}
      >
        {dayEvents.map((event, i) => i < 3 ? (
          <CalendarEvent key={i} {...event}/>
        ) : null)}
      </Modal>
    )
  }
}

const mapState = state => ({
  events: state.orders.events,
  selectedDate: state.orders.selectedDate,
})

const mapDispatch = {
  closeCalendarEventsModal,
}

export default connect(mapState, mapDispatch)(withStyles(s)(CalendarEvents))
