import React from 'react'
import {connect} from 'react-redux'
import {Calendar, Input, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Orders.css'
import {CalendarHeader, Link, PaginationItem} from '../../components'
import {clear, getEvents, getOrders} from '../../reducers/orders'
import LongArrowIcon from '../../static/long-right-arrow.svg'
import debounce from 'lodash/debounce'
import moment from 'moment'
import cn from 'classnames'
import messages from './messages'
import {DEFAULT_DEBOUNCE_TIME} from '../../constants'
import {EVENT_PURCHASE_ROUTES} from '../index'
import {setFlow} from '../../reducers/purchase'

const EVENT_DATE_FORMAT = 'YYYY-MM-DD'

const Event = ({first_name, last_name, occasion, occasion_date, occasion_type, setFlow}) =>
  <Link className={s.event} to={EVENT_PURCHASE_ROUTES[0]} onClick={() => setFlow(EVENT_PURCHASE_ROUTES)}>
    <div className={s.eventDate}>
      <div className={s.eventDay}>{moment(occasion_date, EVENT_DATE_FORMAT).format('D')}</div>
      <div className={s.eventWeekDay}>{moment(occasion_date, EVENT_DATE_FORMAT).format('dddd')}</div>
    </div>
    <div className={s.eventDetails}>
      <div className={s.eventType}>{occasion} ({occasion_type})</div>
      <div className={s.eventName}>{first_name} {last_name}</div>
      <LongArrowIcon className={s.eventArrowIcon}/>
    </div>
  </Link>

class Orders extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
    }

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
    const {ordersCount, orders, page, pageSize, loading, getOrders, events, date, getEvents, intl, setFlow} = this.props
    const columns = [
      {
        title: intl.formatMessage(messages.orderColumn),
        dataIndex: 'order_number',
        key: 'order_number',
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
        render: (items) => `${items.card}${items.gifts ? ` + ${items.gifts.join(', ')}` : ''}`
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
        render: (total) => <React.Fragment>{total} <span className={s.currency}>CHF</span></React.Fragment>
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
            showTotal: (total, range) => intl.formatMessage(messages.tableItems, {range0: range[0], range1: range[1], total}),
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
                const hasEvents = events.find(event => moment(event.occasion_date, EVENT_DATE_FORMAT).isSame(current, 'y'))
                return hasEvents ? <div className={cn(s.hasEvents, today.isSame(current, 'd') && s.inverted)}/> : null
              }}
            />
          </section>
          <section className={s.events}>
            {events.map((event, i) =>
              <Event key={i} {...event} setFlow={setFlow}/>
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
  setFlow,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Orders))
