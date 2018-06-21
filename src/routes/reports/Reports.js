import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Input, Row, Select, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Reports.css'
import PlusIcon from '../../static/plus.svg'
import moment from 'moment'
import {clear, getOccasions, getReports} from '../../reducers/reports'
import {PaginationItem} from '../../components'
import debounce from 'lodash/debounce'
import {DEFAULT_DEBOUNCE_TIME} from '../../constants'

class Reports extends React.Component {
  constructor(props) {
    super(props)

    this.getOccasions = debounce(props.getOccasions, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    // TODO add loading
    const {reports, reportsCount, page, pageSize, loading, getReports, occasions, occasion} = this.props
    const columns = [
      {
        title: 'Contacts',
        dataIndex: 'contacts',
        key: 'contacts',
      },
      {
        title: 'Scheduled At',
        dataIndex: 'scheduled_at',
        key: 'scheduled_at',
      },
      {
        title: 'Item(s)',
        dataIndex: '',
        key: 'card',
        render: ({card, gifts}) => `${card}${gifts ? ` + ${gifts}` : ''}`
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
          <Select
            className={s.occasion}
            allowClear
            showSearch
            placeholder={'Occasion'}
            notFoundContent={loading.occasions ? 'Loading...' : null}
            filterOption={false}
            onSearch={(search) => this.getOccasions({search})}
            value={occasion}
            onChange={(occasion) => getReports({occasion})}
          >
            {occasions.map(item =>
              <Select.Option key={item.title} value={item.title}>{item.title}</Select.Option>
            )}
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={reports}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => getReports({pagination, filters, sorter})}
          pagination={{
            current: page,
            total: reportsCount,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            pageSize,
            showSizeChanger: true,
            itemRender: (current, type, el) => <PaginationItem type={type} el={el}/>
          }}
        />
      </div>
    )
  }
}

const mapState = state => ({
  ...state.reports,
})

const mapDispatch = {
  getReports,
  getOccasions,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Reports))
