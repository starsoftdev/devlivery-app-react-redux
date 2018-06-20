import React from 'react'
import {connect} from 'react-redux'
import {Calendar, Input, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Orders.css'
import {clear, getOrders} from '../../reducers/orders'
import LongArrowIcon from '../../static/long-right-arrow.svg'
import RightArrowIcon from '../../static/right-arrow.svg'
import LeftArrowIcon from '../../static/left-arrow.svg'
import debounce from 'lodash/debounce'

const Event = ({day, weekday, type, name}) =>
  <a className={s.event}>
    <div className={s.eventDate}>
      <div className={s.eventDay}>{day}</div>
      <div className={s.eventWeekDay}>{weekday}</div>
    </div>
    <div className={s.eventDetails}>
      <div className={s.eventType}>{type}</div>
      <div className={s.eventName}>{name}</div>
      <LongArrowIcon className={s.eventArrowIcon}/>
    </div>
  </a>

// TODO get events
const events = [
  {day: 20, weekday: 'Saturday', type: 'Birthday of', name: 'Verena Diener'},
  {day: 25, weekday: 'Thursday', type: 'Birthday of', name: 'MARCO PEREZ'},
]

class Orders extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
    }

    this.getOrders = debounce(this.props.getOrders, 800)
  }

  changeSearch = (e) => {
    const search = e.target.value
    this.setState({search})
    this.getOrders({search})
  }

  render() {
    const {search} = this.state
    // TODO add table loading
    const {ordersCount, orders, page, pageSize, loading, getOrders} = this.props
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
      },
    ]

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
            defaultCurrent: page,
            total: ordersCount,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            pageSize,
            defaultPageSize: pageSize,
            showSizeChanger: true,
            hideOnSinglePage: true,
            itemRender: (current, type, originalElement) => {
              if (type === 'prev') {
                return <a className='ant-pagination-item-link'><LeftArrowIcon/></a>
              } else if (type === 'next') {
                return <a className='ant-pagination-item-link'><RightArrowIcon/></a>
              }
              return originalElement
            }
          }}
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
