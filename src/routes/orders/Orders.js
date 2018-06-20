import React from 'react'
import {connect} from 'react-redux'
import {Calendar, Input, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Orders.css'
import {CalendarHeader, PaginationItem} from '../../components'
import {clear, getEvents, getOrders} from '../../reducers/orders'
import LongArrowIcon from '../../static/long-right-arrow.svg'
import debounce from 'lodash/debounce'
import moment from 'moment'
import cn from 'classnames'

const EVENT_DATE_FORMAT = 'YYYY-MM-DD'

const Event = ({first_name, last_name, occasion, occasion_date, occasion_type}) =>
  <a className={s.event}>
    <div className={s.eventDate}>
      <div className={s.eventDay}>{moment(occasion_date, EVENT_DATE_FORMAT).format('D')}</div>
      <div className={s.eventWeekDay}>{moment(occasion_date, EVENT_DATE_FORMAT).format('dddd')}</div>
    </div>
    <div className={s.eventDetails}>
      <div className={s.eventType}>{occasion} ({occasion_type})</div>
      <div className={s.eventName}>{first_name} {last_name}</div>
      <LongArrowIcon className={s.eventArrowIcon}/>
    </div>
  </a>

class Orders extends React.Component {
  changeSearch = (e) => {
    const search = e.target.value
    this.setState({search})
    this.getOrders({search})
  }

  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
    }

    this.getOrders = debounce(this.props.getOrders, 800)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    const {search} = this.state
    // TODO add table loading
    const {ordersCount, orders, page, pageSize, loading, getOrders, events, date, getEvents} = this.props
    const columns = [
      {
        title: 'Order Number',
        dataIndex: 'order_number',
        key: 'order_number',
      },
      {
        title: 'Order Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Item(s)',
        dataIndex: 'items',
        key: 'items',
        render: (items) => `${items.card}${items.gifts ? ` + ${items.gifts.join(', ')}` : ''}`
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Total Price',
        dataIndex: 'total',
        key: 'total',
        render: (total) => <React.Fragment>{total} <span className={s.currency}>CHF</span></React.Fragment>
      },
    ]
    const today = moment()

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>Orders History</h1>
          {/*TODO add search icon*/}
          <Input
            className={s.search}
            placeholder={'Search'}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            pageSize,
            showSizeChanger: true,
            hideOnSinglePage: true,
            itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>
          }}
        />
        <div className={s.calendarSection}>
          <section className={s.calendar}>
            <div className={s.calendarHeaderWrapper}>
              <h2 className={s.calendarHeader}>Calendar</h2>
              <CalendarHeader value={moment(date)} onValueChange={getEvents}/>
            </div>
            <Calendar
              fullscreen={false}
              value={moment(date)}
              dateCellRender={(current) => {
                const hasEvents = events.find(event => moment(event.occasion_date, EVENT_DATE_FORMAT).isSame(current, 'y'))
                return hasEvents ? <div className={cn(s.hasEvents, today.isSame(current, 'd') && s.inverted)}/> : null
              }}
            />
          </section>
          <section className={s.events}>
            {events.map((event, i) =>
              <Event key={i} {...event}/>
            )}
          </section>
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
  getOrders,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Orders))
