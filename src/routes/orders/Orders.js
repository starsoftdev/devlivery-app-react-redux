import React from 'react'
import {connect} from 'react-redux'
import {Calendar, Input, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Orders.css'
import {CalendarEvent, CalendarEvents, CalendarHeader, PaginationItem} from '../../components'
import {clear, getEvents, getOrders, openCalendarEventsModal, openOrderDetailsModal} from '../../reducers/orders'
import debounce from 'lodash/debounce'
import moment from 'moment'
import cn from 'classnames'
import messages from './messages'
import {DEFAULT_DEBOUNCE_TIME} from '../../constants'
import OrderDetails from './OrderDetails'
import {getEvent} from '../../utils'

class Orders extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: props.orderID ? props.orderID : undefined,
      orderID: props.orderID
    }
    if(props.orderID)
      props.openOrderDetailsModal({id:props.orderID})
    this.getOrders = debounce(this.props.getOrders, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  changeSearch = (e) => {
    const search = e.target.value
    this.setState({search})
    this.getOrders({search})
  }

  render() {
    const {search} = this.state
    // TODO add table loading
    const {
      ordersCount,
      orders,
      page,
      pageSize,
      loading,
      getOrders,
      events,
      date,
      getEvents,
      intl,
      openCalendarEventsModal,
      calendarEventsModalOpened,
      openOrderDetailsModal,
      orderDetailsModalOpened,
      upcomingEvents,
    } = this.props
    
    
    const columns = [
      {
        title: intl.formatMessage(messages.orderColumn),
        dataIndex: 'order_number',
        key: 'order_number',
        render: (orderNumber, order) => <a onClick={() => openOrderDetailsModal(order)}>{orderNumber}</a>
      },
      {
        title: intl.formatMessage(messages.dateColumn),
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: intl.formatMessage(messages.itemsColumn),
        dataIndex: 'items',
        key: 'items',
        render: (items) => items ? `${items.card}${items.gifts && items.gifts.length ? ` + ${items.gifts.join(', ')}` : ''}` : ''
      },
      {
        title: intl.formatMessage(messages.statusColumn),
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: intl.formatMessage(messages.totalColumn),
        dataIndex: 'total',
        key: 'total',
        render: (total) => <React.Fragment>{total} <span className={s.currency}>{'CHF'}</span></React.Fragment>
      },
    ]
    const today = moment()
    
    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
          <Input.Search
            className={s.search}
            placeholder={intl.formatMessage(messages.search)}
            value={search}
            onChange={this.changeSearch}
          />
        </div>
        <Table
          className={s.orders}
          columns={columns}
          dataSource={orders}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => getOrders({pagination, filters, sorter})}
          pagination={{
            current: page,
            total: ordersCount,
            showTotal: (total, range) => intl.formatMessage(messages.tableItems, {
              range0: range[0],
              range1: range[1],
              total
            }),
            pageSize,
            showSizeChanger: true,
            itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>
          }}
        />
        <div className={s.calendarSection}>
          <section className={s.calendar}>
            <div className={s.calendarHeaderWrapper}>
              <h2 className={s.calendarHeader}>{intl.formatMessage(messages.calendar)}</h2>
              <CalendarHeader value={moment(date)} onValueChange={getEvents}/>
            </div>
            <Calendar
              fullscreen={false}
              value={moment(date)}
              dateCellRender={(current) => {
                const hasEvents = events.find(event => getEvent(event, current))
                return hasEvents ? <div className={cn(s.hasEvents, today.isSame(current, 'd') && s.inverted)}/> : null
              }}
              onSelect={(current) => {
                const hasEvents = events.find(event => getEvent(event, current))
                if (hasEvents) {
                  openCalendarEventsModal(current)
                }
              }}
            />
          </section>
          <section className={s.events}>
            {upcomingEvents.sort((a,b)=>{return new Date(a.contact_specific_date)-new Date(b.contact_specific_date)}).map((event, i) =>
              <CalendarEvent key={i} {...event}/>
            )}
          </section>
          {calendarEventsModalOpened && <CalendarEvents/>}
          {orderDetailsModalOpened && <OrderDetails intl={intl}/>}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  ...state.orders,
})

const mapDispatch = {
  getEvents,
  openCalendarEventsModal,
  openOrderDetailsModal,
  getOrders,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Orders))
