import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Input, Row, Select, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Reports.css'
import PlusIcon from '../../static/plus.svg'
import moment from 'moment'

// TODO get team contacts
const contacts = [
  {
    name: 'Fritz Bucco',
    scheduled_at: '01/29/2018',
    items: 'CHRISTMAS CARD+FINE FOODIE',
    occasion: 'BIRTHDAY',
    sent: '1',
    total: '98.00 CHF'
  },
  {
    name: 'Massimo Ceccaroni',
    scheduled_at: '01/15/2018',
    items: 'WELCOME CARD',
    occasion: 'WELCOMING',
    sent: '2',
    total: '15.00 CHF'
  },
]

class Reports extends React.Component {
  render() {
    const {contactsCount, page, pageSize, loading} = this.props
    const columns = [
      {
        title: 'Contact',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Scheduled At',
        dataIndex: 'scheduled_at',
        key: 'scheduled_at',
      },
      {
        title: 'Item(s)',
        dataIndex: 'items',
        key: 'items',
      },
      {
        title: 'Occasion',
        dataIndex: 'occasion',
        key: 'occasion',
      },
      {
        title: 'Sent',
        dataIndex: 'sent',
        key: 'sent',
      },
      {
        title: 'Total Price',
        dataIndex: 'total',
        key: 'total',
      },
    ]

    // TODO add pagination styles
    // !loading.contacts && contactsCount > pageSize ? {
    //         current: page,
    //         defaultCurrent: page,
    //         total: contactsCount,
    //         showTotal: (total, range) => 'total items',
    //         pageSize,
    //         defaultPageSize: pageSize,
    //       } : false

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>Schedule</h1>
          <Button type='primary' ghost>
            <PlusIcon/>
            Export .XLS
          </Button>
        </div>
        <div className={s.filters}>
          <Row type='flex' gutter={20} align='middle' className={s.filterWrapper}>
            <Col>
              <div className={s.label}>
                From:
              </div>
            </Col>
            <Col>
              <Select placeholder={'Month'} className={s.month}>
                {moment.months().map((month, i) =>
                  <Select.Option key={month} value={i + 1}>{month}</Select.Option>
                )}
              </Select>
            </Col>
            <Col className={s.date}>
              <Input placeholder={'Date'}/>
            </Col>
          </Row>
          <Row type='flex' gutter={20} align='middle' className={s.filterWrapper}>
            <Col>
              <div className={s.label}>
                To:
              </div>
            </Col>
            <Col>
              <Select placeholder={'Month'} className={s.month}>
                {moment.months().map((month, i) =>
                  <Select.Option key={month} value={i + 1}>{month}</Select.Option>
                )}
              </Select>
            </Col>
            <Col className={s.date}>
              <Input placeholder={'Date'}/>
            </Col>
          </Row>
          <Select placeholder={'Occasion'} className={s.occasion}>
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={contacts}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => console.log({pagination, filters, sorter})}
          pagination={false}
        />
      </div>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Reports))
