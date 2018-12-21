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
import LinesEllipsis from 'react-lines-ellipsis'

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
    filterType: 'delivery',
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
    let ordered = false;
    if(this.state.filterType === 'ordered')
    {
      var date = new Date();
      date.setDate(date.getDate());
      ordered = endValue.valueOf() > (date);
    }
    return (endValue.valueOf() <= startValue.valueOf()) || ordered
  }

  onStartChange = (value) => {
    const { filterType } = this.state;
    this.setState({ startValue: value });
    switch (filterType) {
      case 'shipping':
        this.props.getReports({ from_shipping: value, to: undefined, from: undefined, from_ordered: undefined, to_ordered: undefined });
        break;
      case 'ordered':
        this.props.getReports({ from_ordered: value, from_shipping: undefined, to_shipping: undefined, to: undefined, from: undefined });
        break;
      default:
        this.props.getReports({ from: value, from_shipping: undefined, to_shipping: undefined, from_ordered: undefined, to_ordered: undefined });
    }
  }

  onEndChange = (value) => {
    const { filterType } = this.state;
    this.setState({ endValue: value });
    switch (filterType) {
      case 'shipping':
        this.props.getReports({ to_shipping: value,  to: undefined, from: undefined, from_ordered: undefined, to_ordered: undefined });
        break;
      case 'ordered':
        this.props.getReports({ to_ordered: value, from_shipping: undefined, to_shipping: undefined, to: undefined, from: undefined });
        break;
      default:
        this.props.getReports({ to: value, from_shipping: undefined, to_shipping: undefined, from_ordered: undefined, to_ordered: undefined });
    }
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({endOpen: true})
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({endOpen: open})
  }

  changeFilterType = (type) => {
    const { startValue, endValue } = this.state;
    this.setState({ filterType: type });
    switch (type) {
      case 'shipping':
        this.props.getReports({ from_shipping: startValue, to_shipping: endValue,  to: undefined, from: undefined, from_ordered: undefined, to_ordered: undefined });
        break;
      case 'ordered':
        this.props.getReports({ from_ordered: startValue, to_ordered: endValue, from_shipping: undefined, to_shipping: undefined, to: undefined, from: undefined });
        break;
      default:
        this.props.getReports({ from: startValue, to: endValue, from_shipping: undefined, to_shipping: undefined, from_ordered: undefined, to_ordered: undefined });
    }
  }

  render() {
    // TODO add loading
    const { startValue, endValue, endOpen, filterType } = this.state
    const {reports, reportsCount, page, pageSize, loading, getReports, occasions, occasion, intl, exportReport} = this.props
    const columns = [
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
        title: intl.formatMessage(messages.scheduledAtColumn),
        dataIndex: 'delivery_date',
        key: 'delivery_date',
      },
      {
        title: intl.formatMessage(messages.shippingdate),
        dataIndex: 'shipping_date',
        key: 'shipping_date',
      },
      {
        title: intl.formatMessage(messages.orderat),
        dataIndex: 'created_at',
        key: 'created_at',
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
        render: (total) => <React.Fragment><span className={s.currency}>{'CHF'}</span> {total}</React.Fragment>
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
            className={s.filterType}
            placeholder={intl.formatMessage(messages.filterType)}
            filterOption={false}
            value={filterType}
            onChange={(type) => this.changeFilterType(type)}
          >
            <Select.Option value="delivery">{intl.formatMessage(messages.delivery)}</Select.Option>
            <Select.Option value="shipping">{intl.formatMessage(messages.shipping)}</Select.Option>
            <Select.Option value="ordered">{intl.formatMessage(messages.ordered)}</Select.Option>
          </Select>
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
          locale={{ emptyText: 'No Scheduled' }}
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
