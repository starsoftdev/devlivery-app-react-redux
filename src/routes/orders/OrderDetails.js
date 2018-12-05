import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './OrderDetails.css'
import { Col, Modal, Row, Table, Button, Carousel } from 'antd'
import { connect } from 'react-redux'
import { closeOrderDetailsModal } from '../../reducers/orders'
import messages from './messages'
import { getItemImage } from '../../utils'
import { CARD_IMAGES_PROP, GIFT_IMAGES_PROP, GIFT_GALLERY_PROP } from '../../constants'
import cn from 'classnames';
import BackIcon from '../../static/view_list.svg'
import { setFlowPayment } from '../../reducers/purchase'
import moment from 'moment'

const CARD_TYPE = 'card'
const GIFT_TYPE = 'gift'
// TODO add info in table for voucher and donation
const VOUCHER_TYPE = 'voucher'
const DONATION_TYPE = 'donation'

class OrderDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentShipping: 0,
      cardPreview: false,
      giftDetails: null,
      entirePay: false
    }
  }

  prevShipping = () => {
    if (this.state.currentShipping !== 0) {
      this.setState({ currentShipping: this.state.currentShipping - 1 })
    }
  }

  nextShipping = () => {
    if (this.state.currentShipping !== this.props.orderDetails.recipients.length - 1) {
      this.setState({ currentShipping: this.state.currentShipping + 1 })
    }
  }
  renderRecipientInf = (recipients) => {
    const {currentShipping} = this.state;
    if (recipients && recipients.length > 0)
    {
      const selRecipient = recipients[currentShipping];
      let shipping_name = null;
      if(selRecipient.receiving_address.first_name || selRecipient.receiving_address.last_name)
      {
        shipping_name = (selRecipient.receiving_address.first_name?selRecipient.receiving_address.first_name+' ':'')+(selRecipient.receiving_address.last_name ? selRecipient.receiving_address.last_name:'')
      } else {
        if(this.props.orderDetails.deliverable==='shipping')
          shipping_name = this.props.user.first_name+' '+this.props.user.last_name;
      }
      const recipient_name = selRecipient.contact.first_name + ' ' + selRecipient.contact.last_name;

      return (
        <React.Fragment>
          <div className={s.shippingDetails}>
            <h3>Shipping details {currentShipping + 1} / {recipients.length}</h3>
            {/*<span>{selRecipient.receiving_address.title}</span><br />*/}
            <span>{shipping_name ? (shipping_name+' (For: '+recipient_name+')'):recipient_name}</span><br />
            <span>{selRecipient.receiving_address.address}</span><br />
            <span>{(selRecipient.receiving_address.postal_code ? selRecipient.receiving_address.postal_code : '') + ' ' + (selRecipient.receiving_address.city ? selRecipient.receiving_address.city : '')}</span><br />
            <span>{selRecipient.receiving_address.country ? selRecipient.receiving_address.country : ''}</span><br />
          </div>
          {
            recipients.length > 1 &&
            <div className={s.shippingButtons}>
              <Button
                type='primary'
                onClick={this.prevShipping}
                size='small'
                ghost
              >
                Prev
              </Button>
              <Button
                type='primary'
                onClick={this.nextShipping}
                size='small'
              >
                next
              </Button>
            </div>
          }
        </React.Fragment>
      );
    }
    return (<React.Fragment/>);
  }
  render() {

    const { closeOrderDetailsModal, orderDetails, intl, occasions, setFlowPayment, recipient_id } = this.props
    const { currentShipping } = this.state;
    let recipient = null;
    if (orderDetails && orderDetails.recipients && recipient_id && !this.state.entirePay) {
      recipient = orderDetails.recipients.filter(item => item.id+'' === recipient_id+'');
    }
    const recp_count =  orderDetails && orderDetails.recipients_count ? orderDetails.recipients_count : 1;
    const recipients = [orderDetails && (recipient ? recipient : orderDetails.recipients)];
   
    const columns = [
      {
        title: intl.formatMessage(messages.productColumn),
        dataIndex: '',
        key: 'title',
        className: s.productColumn,
        render: (item) => {
          switch (item.productType) {
            case CARD_TYPE:
              return (
                <div className={cn(s.product, s.touch)} onClick={() => this.setState({ cardPreview: 'card' })}>
                  <div style={{ backgroundImage: `url(${getItemImage(item, CARD_IMAGES_PROP)})`, minWidth: '150px' }} className={s.productImage} />
                  <div className={s.title}>{item.title}</div>
                </div>
              )
            case GIFT_TYPE:
              return (
                <div className={cn(s.product, s.touch)} onClick={() => this.setState({ cardPreview: 'gift', giftDetails: item })}>
                  <div style={{ backgroundImage: `url(${getItemImage(item, GIFT_IMAGES_PROP)})`, minWidth: '150px' }} className={s.productImage} />
                  <div className={s.title}>{item.title}</div>
                </div>
              )
            case VOUCHER_TYPE:
              return (
                <div className={s.product}>
                  <div className={s.productImage}>
                    <div className={s.voucherContain}>
                      <span className={s.title}>
                        <strong>{intl.formatMessage(messages.datefrom)}</strong>
                        {" " + item.from}
                      </span>
                      <br />
                      <span className={s.title}>
                        <strong>{intl.formatMessage(messages.dateto)+':'}</strong>
                        {" " + recipients ? (recipients[currentShipping].contact.first_name + ' ' + recipients[currentShipping].contact.last_name):item.to}
                      </span>
                    </div>
                  </div>
                  <div className={s.title}>{item.title}</div>
                </div>
              )
            case DONATION_TYPE:
              return (
                <div className={s.product}>
                  <div style={{ backgroundImage: `url(${getItemImage(item, 'logo')})` }} className={s.productImage} />
                  <div className={s.title}>{item.name}</div>
                </div>
              )
            default:
              return null
          }
        }
      },
      {
        title: intl.formatMessage(messages.quantityColumn),
        dataIndex: '',
        key: 'quantity',
        className: s.quantityColumn,
        render: (item) => {
          let quantity = ''

          if (item.productType === CARD_TYPE) {
            quantity = 1
          } else if (item.productType === GIFT_TYPE) {
            quantity = item.quantity
          } else if (item.productType === VOUCHER_TYPE) {
            quantity = 1
          } else if (item.productType === DONATION_TYPE) {
            //quantity = item.amount
          }

          return (
            <div>{quantity}</div>
          )
        }
      },
      {
        title: intl.formatMessage(messages.priceColumn),
        dataIndex: '',
        key: 'price',
        className: s.priceColumn,
        render: (item) => {
          return (
            <React.Fragment>
              <span className={s.currency}>{item.currency ? item.currency : 'CHF'}</span>
              {item.productType === DONATION_TYPE ? item.amount:item.price_with_tax}
            </React.Fragment>
          )
        }
      },
    ]
    var key = 0;
    var dataSource = orderDetails ? [
      {
        ...orderDetails.items.card,
        productType: CARD_TYPE,
        key
      },
      ...orderDetails.items.gifts.map(item => {
        key++;
        return {
          ...item.gift,
          quantity: item.quantity,
          productType: GIFT_TYPE,
          key
        }
      }),
    ] : [];
    key++;
    if (orderDetails && orderDetails.donation && orderDetails.donation.organization) {
      dataSource.push({
        ...orderDetails.donation.organization,
        productType: DONATION_TYPE,
        amount: orderDetails.donation.amount,
        key
      });
      key++;
    }
    if (orderDetails && orderDetails.voucher) {
      dataSource.push({
        ...orderDetails.voucher,
        productType: VOUCHER_TYPE,
        key
      });
      key++;
    }
    const cardDetails = orderDetails && orderDetails.items['card'];
    var occasionByCardId = null;
    if (cardDetails && occasions)
      occasionByCardId = occasions.filter(item => item.id === cardDetails.occasion_id);

    //var giftDetails = null;
    //if (orderDetails && orderDetails.items['gifts'] && orderDetails.items['gifts'].length > 0)
    //giftDetails = orderDetails.items['gifts'][0].gift;
    const { giftDetails } = this.state;
    // TODO add shipping price/info
    return (
      <Modal
        visible
        title={intl.formatMessage(messages.orderDetailsHeader)}
        onOk={closeOrderDetailsModal}
        onCancel={closeOrderDetailsModal}
        width={900}
        footer={
          this.state.cardPreview &&
          <div style={{ width: '100%', textAlign: 'right' }}>
            <Button type='primary' size={'small'} style={{ alignSelf: 'right' }} ghost onClick={() => this.setState({ cardPreview: false })}>
              {'Back'}
            </Button>
          </div>
        }
      >
        {!this.state.cardPreview && orderDetails ? (
          <React.Fragment>
            <div className={s.headerWrapper}>
              <h1 className={s.header}>{`#${orderDetails.order_number}`}</h1>
              <div className={s.date}>{orderDetails.created_at}</div>
            </div>
            <Row type='flex' gutter={20}>
              <Col xs={24} sm={16}>
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  rowKey={record => record.key}
                  pagination={false}
                />
                {
                  orderDetails.incomplete_payment &&
                  <div className={s.paybutton}>
                    <Button type='primary' onClick={() => {
                      setFlowPayment(orderDetails)
                    }}>
                      {'Pay'}
                    </Button>
                  </div>
                }
              </Col>
              <Col xs={24} sm={8}>
                <section className={s.summary}>
                  <header className={s.summaryHeader}>
                    {intl.formatMessage(messages.summary)}
                  </header>
                  {
                    (orderDetails.delivery_occasion || orderDetails.delivery_date) &&
                    <div className={s.summaryInfoContent}>
                      {
                        orderDetails.delivery_occasion &&
                        <Row type='flex' justify='space-between' className={s.summaryRow}>
                          <Col>{intl.formatMessage(messages.deliveryoccasion)}</Col>
                          <Col>
                            {orderDetails.delivery_occasion}
                          </Col>
                        </Row>
                      }
                      {
                        orderDetails.delivery_date &&
                        <Row type='flex' justify='space-between' className={s.summaryRow}>
                          <Col>{intl.formatMessage(messages.deliveryDate)}</Col>
                          <Col>
                            {moment(orderDetails.delivery_date).format('DD-MM-YYYY')}
                          </Col>
                        </Row>
                      }
                    </div>
                  }
                  <div className={s.summaryContent}>
                    <Row type='flex' justify='space-between' className={s.summaryRow}>
                      <Col>{intl.formatMessage(messages.summarySubtotal)}</Col>
                      <Col>
                        <span className={s.currency}>{'CHF'}</span>
                        {recipient ? orderDetails.bundle_subtotal.toFixed(2) :  (orderDetails.bundle_total * recp_count).toFixed(2)}
                      </Col>
                    </Row>
                    {/*
                    <Row type='flex' justify='space-between' className={s.summaryRow}>
                      <Col>{intl.formatMessage(messages.summaryTaxes)}</Col>
                      <Col>
                        <span className={s.currency}>{'CHF'}</span>
                        {recipient ? orderDetails.bundle_tax.toFixed(2) : (orderDetails.bundle_tax * recp_count).toFixed(2)}
                      </Col>
                    </Row>
                    */}
                    <Row type='flex' justify='space-between' className={s.summaryRow}>
                      <Col>{intl.formatMessage(messages.summaryShipping)}</Col>
                      <Col>
                        <span className={s.currency}>{'CHF'}</span>
                        {orderDetails.shipping_cost.toFixed(2)}
                      </Col>
                    </Row>
                    {/*
                      orderDetails.coupon && recipient === null && 
                      <Row type='flex' justify='space-between' className={s.summaryRow}>
                        <Col>{'Coupon ('+orderDetails.coupon.coupon+')'}</Col>
                        <Col>
                          {
                            orderDetails.coupon.type==='absolute' &&
                            <span className={s.currency}>{'CHF'}</span>
                          }
                          {'-'}{orderDetails.coupon.value.toFixed(2)}
                          {
                            orderDetails.coupon.type!=='absolute' &&
                            <span className={s.currency}>{' %'}</span>
                          }
                        </Col>
                      </Row>*/
                    }
                  </div>
                  <footer className={s.summaryFooter}>
                    <div>{intl.formatMessage(messages.summaryTotal)}</div>
                    <div>
                      <span className={s.currency}>{'CHF'}</span>
                      {orderDetails.total.toFixed(2)}
                    </div>
                  </footer>
                  {
                    orderDetails.incomplete_payment && recipient &&
                    <div className={s.summaryContent}>
                      <Button type='primary' ghost size={'small'} className={s.entirepaybtn} onClick={()=>{this.setState({entirePay: true})}}>
                        {'Pay for Entire Order'}
                      </Button>
                    </div>
                  }
                </section>
                <section>
                  {this.renderRecipientInf(recipients)}
                </section>
              </Col>
            </Row>
          </React.Fragment>
        ) : null}
        {
          this.state.cardPreview === 'card' && orderDetails && cardDetails ? (
            <React.Fragment>
              <Row>
                <Col md={16} style={{ paddingLeft: 20, paddingRight: 20 }}>
                  <Row className={s.detailRow}>
                    <Carousel
                      loop
                      customPaging={() => (
                        <div className={s.dotWrapper}>
                          <div className={s.dot} />
                        </div>
                      )}
                    >
                      {[...cardDetails.front_image, ...cardDetails.images].map((image, i) => image.url ? (
                        <div key={i}>
                          <div style={{ backgroundImage: `url(${image.url})` }} className={s.previewImage} />
                        </div>
                      ) : null
                      )}
                    </Carousel>
                  </Row>
                </Col>
                <Col md={8}>
                  <Row className={s.detailRow}>
                    <Col md={12}>
                      <span className={s.DetailTitle}>{intl.formatMessage(messages.style)}</span><br />
                      <span className={s.Detail}>{cardDetails.style}</span>
                    </Col>
                    <Col md={12}>
                      <span className={s.DetailTitle}>{intl.formatMessage(messages.occasion)}</span><br />
                      <span className={s.Detail}>{occasionByCardId && occasionByCardId.length > 0 && occasionByCardId[0].title}</span>
                    </Col>
                  </Row>
                  <Row className={s.detailRow}>
                    <Col md={12}>
                      <span className={s.DetailTitle}>{intl.formatMessage(messages.size)}</span><br />
                      <span className={s.Detail}>{cardDetails.size === '4" X 9"' ? '9" X 4"':cardDetails.size}</span>
                    </Col>
                    <Col md={12}>
                      <span className={s.DetailTitle}>{intl.formatMessage(messages.priceColumn)}</span><br />
                      <span className={s.Detail}>{cardDetails.currency+" "+cardDetails.price_with_tax}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </React.Fragment>
          ) : null
        }
        {
          this.state.cardPreview === 'gift' && orderDetails && giftDetails ? (
            <React.Fragment>
              <Row>
                <Col md={16} style={{ paddingLeft: 20, paddingRight: 20 }}>
                  <Row className={s.detailRow}>
                    <Carousel
                      loop
                      customPaging={() => (
                        <div className={s.dotWrapper}>
                          <div className={s.dot} />
                        </div>
                      )}
                    >
                      {giftDetails[GIFT_GALLERY_PROP].map((image, i) => image.url ? (
                        <div key={i}>
                          <div style={{ backgroundImage: `url(${image.url})` }} className={s.previewImage} />
                        </div>
                      ) : null
                      )}
                    </Carousel>
                  </Row>
                </Col>
                <Col md={8}>
                  <Row className={s.detailRow}>
                    <Col md={24}>
                      <span className={s.DetailTitle}>{intl.formatMessage(messages.description)}</span><br />
                      <span className={s.Detail}>{giftDetails.description}</span>
                    </Col>
                  </Row>
                  <Row className={s.detailRow}>
                    <Col md={12}>
                      <span className={s.DetailTitle}>{intl.formatMessage(messages.priceColumn)}</span><br />
                      <span className={s.Detail}>{giftDetails.currency+" "+giftDetails.price_with_tax }</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </React.Fragment>
          ) : null
        }
      </Modal>
    )
  }
}

const mapState = state => ({
  orderDetails: state.orders.orderDetails,
  occasions: state.cards.occasions,
  user: state.user.user
})

const mapDispatch = {
  closeOrderDetailsModal,
  setFlowPayment
}

export default connect(mapState, mapDispatch)(withStyles(s)(OrderDetails))
