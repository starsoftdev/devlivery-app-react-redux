import React from 'react'
import {connect} from 'react-redux'
import {Calendar, Input, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Orders.css'
import {clear, getOrders} from '../../reducers/orders'
import ArrowIcon from '../../static/right-arrow.svg'

const Event = ({day, weekday, type, name}) =>
  <a className={s.event}>
    <div className={s.eventDate}>
      <div className={s.eventDay}>{day}</div>
      <div className={s.eventWeekDay}>{weekday}</div>
    </div>
    <div className={s.eventDetails}>
      <div className={s.eventType}>{type}</div>
      <div className={s.eventName}>{name}</div>
      <ArrowIcon className={s.eventArrowIcon}/>
    </div>
  </a>

// TODO get events
const events = [
  {day: 20, weekday: 'Saturday', type: 'Birthday of', name: 'Verena Diener'},
  {day: 25, weekday: 'Thursday', type: 'Birthday of', name: 'MARCO PEREZ'},
]

class Orders extends React.Component {
  render() {
    const {ordersCount, orders, page, pageSize, loading} = this.props
    const columns = [
      {
        title: 'Order Number',
        dataIndex: 'order_number',
        key: 'order_number',
      },
      {
        title: 'Order Date',
        dataIndex: 'completed_at',
        key: 'completed_at',
      },
      {
        title: 'Item(s)',
        dataIndex: 'item',
        key: 'item',
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
      },
    ]

    // TODO add pagination styles
    // !loading.orders && ordersCount > pageSize ? {
    //         current: page,
    //         defaultCurrent: page,
    //         total: ordersCount,
    //         showTotal: (total, range) => 'total items',
    //         pageSize,
    //         defaultPageSize: pageSize,
    //       } : false

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>Orders History</h1>
          {/*TODO add search icon*/}
          <Input className={s.search} placeholder={'Search'}/>
        </div>
        <Table
          className={s.orders}
          columns={columns}
          dataSource={orders}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => getOrders({pagination, filters, sorter})}
          pagination={false}
        />
        <div className={s.calendarSection}>
          <section className={s.calendarWrapper}>
            <h2 className={s.calendarHeader}>Calendar</h2>
            {/*TODO add date switcher*/}
            <Calendar fullscreen={false}/>
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
  getOrders,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Orders))
