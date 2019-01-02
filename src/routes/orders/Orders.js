import React from 'react'
import { connect } from 'react-redux'
import { Calendar, Input, Table, Spin, Pagination, Row } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Orders.css'
import { CalendarEvent, CalendarEvents, CalendarHeader, PaginationItem } from '../../components'
import { clear, getEvents, getOrders, openCalendarEventsModal, openOrderDetailsModal, getUpcomingEvents } from '../../reducers/orders'
import debounce from 'lodash/debounce'
import moment from 'moment'
import cn from 'classnames'
import messages from './messages'
import { DEFAULT_DEBOUNCE_TIME } from '../../constants'
import OrderDetails from './OrderDetails'
import { getEvent } from '../../utils'
import LinesEllipsis from 'react-lines-ellipsis'

class Orders extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: props.orderID ? props.orderID : undefined,
      orderID: props.orderID
    }
    if (props.orderID)
      props.openOrderDetailsModal({ id: props.orderID })
    this.getOrders = debounce(this.props.getOrders, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  changeSearch = (e) => {
    const search = e.target.value
    this.setState({ search })
    this.getOrders({ search })
  }

  render() {
    const { search } = this.state
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
      upcomingCount,
      upcomingpage,
      upcomingpageSize,
      getUpcomingEvents
    } = this.props


    const columns = [
      {
        title: intl.formatMessage(messages.orderColumn),
        dataIndex: 'order_number',
        key: 'order_number',
        render: (orderNumber, order) => <a onClick={() => openOrderDetailsModal(order)}>{orderNumber}</a>
      },
      {
        title: intl.formatMessage(messages.contactsColumn),
        dataIndex: 'contacts',
        key: 'contacts',
        render: (contacts) => <LinesEllipsis
                                text={contacts}
                                maxLine='2'
                                ellipsis='...'
                                trimRight={false}
                                basedOn='words'
                              />
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
        render: (total) => <React.Fragment><span className={s.currency}>{'CHF'}</span> {total}</React.Fragment>
      },
    ]
    const upcoming_columns = [
      {
        key: 'item',
        render: (event) => <CalendarEvent key={event.id + ''} {...event} />
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
          locale={{ emptyText: intl.formatMessage(messages.noorder) }}
          loading={loading.orders}
          className={s.orders}
          columns={columns}
          dataSource={orders}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => {
            window.scrollTo(0, 0)
            getOrders({ pagination, filters, sorter })
          }}
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
            itemRender: (current, type, el) => <PaginationItem type={type} el={el} />
          }}
        />
        <div className={s.calendarSection}>
          <section className={s.calendar}>
            <div className={s.calendarHeaderWrapper}>
              <h2 className={s.calendarHeader}>{intl.formatMessage(messages.calendar)}</h2>
              <CalendarHeader value={moment(date)} onValueChange={getEvents} />
            </div>
            <Calendar
              fullscreen={false}
              value={moment(date)}
              dateCellRender={(current) => {
                const hasEvents = events.find(event => getEvent(event, current))
                return hasEvents ? <div className={cn(s.hasEvents, today.isSame(current, 'd') && s.inverted)} /> : null
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
            {
              <Spin spinning={loading.upcomingEvents}>
                <React.Fragment>
                  {
                    upcomingEvents.map((event, i) =>
                      <CalendarEvent key={event.id+''} {...event} />
                    )
                  }
                  {
                    upcomingEvents.length > 0 &&
                    <div className={s.footer}>
                      <Pagination
                        size="small"
                        current={upcomingpage}
                        total={upcomingCount}
                        showTotal={(total, range) => intl.formatMessage(messages.tableItems, { range0: range[0], range1: range[1], total })}
                        pageSize={upcomingpageSize}
                        showSizeChanger
                        onChange={(current, pageSize) => getUpcomingEvents({ pagination: { current, pageSize } })}
                        onShowSizeChange={(current, pageSize) => getContacts({ pagination: { current, pageSize } })}
                        itemRender={(current, type, el) => <PaginationItem type={type} el={el} />}
                        //pageSizeOptions={pageSizeOptions}
                        showSizeChanger = {false}
                      />
                    </div>
                  }
                </React.Fragment>
              </Spin>
            }
          </section>
          {calendarEventsModalOpened && <CalendarEvents intl={intl}/>}
          {orderDetailsModalOpened && <OrderDetails intl={intl} recipient_id={this.props.recipient_id} />}
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
  getUpcomingEvents
}

export default connect(mapState, mapDispatch)(withStyles(s)(Orders))
