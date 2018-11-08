import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, DatePicker, Row, Select, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Reports.css'
import PlusIcon from '../../static/plus.svg'
import {clear, exportReport, getOccasions, getReports} from '../../reducers/reports'
import {PaginationItem} from '../../components'
import debounce from 'lodash/debounce'
import {DATE_FORMAT, DEFAULT_DEBOUNCE_TIME, DISPLAYED_DATE_FORMAT} from '../../constants'
import messages from './messages'

class Reports extends React.Component {
  constructor(props) {
    super(props)

    this.getOccasions = debounce(props.getOccasions, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  onStartChange = (value) => {
    this.setState({startValue: value})
    this.props.getReports({from: value})
  }

  onEndChange = (value) => {
    this.setState({endValue: value})
    this.props.getReports({to: value})
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({endOpen: true})
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({endOpen: open})
  }

  render() {
    // TODO add loading
    const { startValue, endValue, endOpen } = this.state
    const {reports, reportsCount, page, pageSize, loading, getReports, occasions, occasion, intl, exportReport} = this.props
    const columns = [
      {
        title: intl.formatMessage(messages.contactsColumn),
        dataIndex: 'contacts',
        key: 'contacts',
      },
      {
        title: intl.formatMessage(messages.scheduledAtColumn),
        dataIndex: 'delivery_date',
        key: 'delivery_date',
      },
      {
        title: intl.formatMessage(messages.itemsColumn),
        dataIndex: '',
        key: 'card',
        render: ({card, gifts}) => `${card}${gifts ? ` + ${gifts}` : ''}`
      },
      {
        title: intl.formatMessage(messages.occasionColumn),
        dataIndex: 'occasion',
        key: 'occasion',
      },
      {
        title: intl.formatMessage(messages.sentColumn),
        dataIndex: 'sent',
        key: 'sent',
      },
      {
        title: intl.formatMessage(messages.totalColumn),
        dataIndex: 'total',
        key: 'total',
      },
    ]

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
          <Button type='primary' ghost onClick={exportReport}>
            <PlusIcon/>
            {intl.formatMessage(messages.export)}
          </Button>
        </div>
        <div className={s.filters}>
          <Row type='flex' gutter={20} align='middle' className={s.filterWrapper}>
            <Col>
              <div className={s.label}>
              {intl.formatMessage(messages.datefrom)}
              </div>
            </Col>
            <Col>
              <DatePicker
                disabledDate={this.disabledStartDate}
                format={DISPLAYED_DATE_FORMAT}
                value={startValue}
                placeholder={intl.formatMessage(messages.datestart)}
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
              />
            </Col>
          </Row>
          <Row type='flex' gutter={20} align='middle' className={s.filterWrapper}>
            <Col>
              <div className={s.label}>
              {intl.formatMessage(messages.dateto)}
              </div>
            </Col>
            <Col>
              <DatePicker
                disabledDate={this.disabledEndDate}
                format={DISPLAYED_DATE_FORMAT}
                value={endValue}
                placeholder={intl.formatMessage(messages.dateend)}
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
              />
            </Col>
          </Row>
          <Select
            className={s.occasion}
            allowClear
            showSearch
            placeholder={intl.formatMessage(messages.occasion)}
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
          loading = {loading.reports}
          columns={columns}
          dataSource={reports}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) => getReports({pagination, filters, sorter})}
          pagination={{
            current: page,
            total: reportsCount,
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
  exportReport,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Reports))
