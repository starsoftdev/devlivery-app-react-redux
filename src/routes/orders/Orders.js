import React from 'react'
import {connect} from 'react-redux'
import {Link} from '../../components'
import {Alert, Button, Col, Form, Input, Row, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Orders.css'
import {getOrders, clear} from '../../reducers/orders'

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
          columns={columns}
          dataSource={orders}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => getOrders({pagination, filters, sorter})}
          pagination={false}
        />
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
