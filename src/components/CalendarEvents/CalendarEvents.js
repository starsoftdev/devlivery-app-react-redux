import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './CalendarEvents.css'
import {Modal} from 'antd'
import {connect} from 'react-redux'
import {closeCalendarEventsModal} from '../../reducers/orders'
import moment from 'moment'
import {CalendarEvent} from '../'
import {getEvent} from '../../utils'
import messages from '../../routes/orders/messages'

class CalendarEvents extends React.Component {
  render() {
    const {closeCalendarEventsModal, events, selectedDate,intl} = this.props
    const dayEvents = events.filter(event => getEvent(event, moment(selectedDate)))
    return (
      <Modal
        visible
        title={`${intl.formatMessage(messages.events_on)} ${moment(selectedDate).format('DD MMM YYYY')}`}
        onOk={closeCalendarEventsModal}
        onCancel={closeCalendarEventsModal}
        width={500}
        footer={null}
      >
        {dayEvents.map((event, i) =>
          <CalendarEvent key={i} {...event}/>
        )}
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
