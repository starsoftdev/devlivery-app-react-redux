import React from 'react'
import { connect } from 'react-redux'
import {
  submitShipping,
  removeRecipientsOrder,
  syncGifts_Bundle,
  toAddContactFlowStep,
  removeDontationFromBundle,
  removeVoucherFromBundle,
  recalculateTotal,
  applycouponTotal
}
  from '../../reducers/purchase'
import { Button, Col, DatePicker, Form, Row, Select, message, Checkbox, Input, Popconfirm } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase11.css'
import { OrderItems, PurchaseActions, SectionHeader } from '../../components'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import formMessages from '../../formMessages'
import messages from './messages'
import { DATE_FORMAT, DISPLAYED_DATE_FORMAT } from '../../constants'
import moment from 'moment-timezone'

import { Editor } from '@tinymce/tinymce-react';
import * as Contants from '../../constants';
import { injectGlobal } from 'styled-components';
import PlusIcon from '../../static/plus.svg'
import RemoveIcon from '../../static/remove.svg'
import { FloatingLabel } from '../../components';
import { INDIVIDUAL_ACCOUNT, TEAM_ACCOUNT } from '../../reducers/register'
import Loader from 'react-loader';

import {
  ORDER_BUNDLE_FLOW,
  ORDER_VOUCHER_FLOW
} from '../../routes'

injectGlobal`
  .mce-notification-warning{
    display: none !important;
  }
  iframe {overflow:hidden;}
  .mceContentBody{
    overflow-y:hidden !important;
  }
`
const ORDER_CONFIRM_STATE = 'order_confirm_state'

class Purchase11 extends React.Component {
  // TODO refactor and reuse code from OrderDetails.js
  constructor(props) {
    super(props)
    this.state = {
      currentRecipient: 0,
      mounted: false,
      content: '',
      fontlink: [],
      order: props.order,
      disableSubmit: false,
      selectedLocation: 'shipping',
      selOccasion: null,
      selDate: (props.newrecipient && props.newrecipient.dob) || props.deliveryTime,
      contact: null,
      checkSave: props.saved || 0,
      bundleName: '',
      recip_warnmsg: '',
      couple: undefined,
      loadingEditor: false
    }
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.onCheckSaved = this.onCheckSaved.bind(this);
  }
  componentWillMount() {
    this.loadLocalStorage();
  }
  async loadLocalStorage() {
    var initState = await localStorage.getItem(ORDER_CONFIRM_STATE);
    initState = JSON.parse(initState);
    this.setState({ ...initState });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.cardDetails) {
      this.setState({ content: nextProps.cardDetails.body ? nextProps.cardDetails.body : '' });
    }
    if (nextProps && nextProps.order !== this.state.order) {

      if (this.state.contact) {
        this.state.order = nextProps.order;
      } else this.setState({ order: nextProps.order });
      this.onSelectLocation(this.state.selectedLocation);
    }
    if (nextProps && nextProps.order && nextProps.order.coupon && this.state.couple === undefined) {
      this.setState({ couple: nextProps.order.coupon && nextProps.order.coupon.coupon });
    }
    if (nextProps && nextProps.deliveryOccations.length > 0 && nextProps.deliveryOccations.length !==  this.props.deliveryOccations.length) {
      this.setState({ selOccasion: nextProps.deliveryOccations[0] });
    }
  }
  componentDidMount() {
    // load editor only on client side (not server side)
    const newState = {
      mounted: true
    }
    this.state.fontlink = Contants.FONTS.map(font =>
      `//fonts.googleapis.com/css?family=${font}`
    )
    this.setState(newState)
    console.log('Zurich Time', moment().tz("Europe/Zurich").format());
  }
  onSelectLocation = (value) => {
    this.props.recalculateTotal(value);

    const { order, currentRecipient, selectedLocation } = this.state;
    if (value === 'shipping') {
      const { user } = this.props;
      const address = user && user.addresses && user.addresses.find(item => item.default !== null)

      this.setState({ selectedLocation: value, contact: { ...address, ...user, title: ' ' }, recip_warnmsg: '' });
      return;
    }
    else if (order && order.recipients && order.recipients[currentRecipient]) {
      this.validateRecipientsAddress(value)

      var selRecipient = order.recipients[currentRecipient];
      var filter_contact = selRecipient.contact.addresses.filter(item => item.title === value);

      if (filter_contact === null || filter_contact.length <= 0) {
        filter_contact = selRecipient.contact.addresses;
      }
      if (filter_contact) {
        const contact = filter_contact.length > 0 ? filter_contact[0] : null;
        this.setState({ selectedLocation: value, contact: { ...contact, ...selRecipient.contact } });
      }
      else this.setState({ selectedLocation: value, contact: null });
    }
    else {
      this.setState({ ...this.state, selectedLocation: value, contact: null })
    }
  }
  validateRecipientsAddress(value) {
    const { order } = this.state;
    if (order.recipients) {
      var filterRecp = order.recipients.filter(recipient => {
        const address = recipient.contact.addresses.filter(item => item.title === value);
        return address.length > 0 ? true : false;
      })
      if (filterRecp.length !== order.recipients.length) {
        this.setState({
          recip_warnmsg: value === 'home' ? 'Home address is not available for all recipients, in this case we will use Company address instead.' : 'Company address is not available for all recipients, in this case we will use Home address instead.'
        });
        return;
      }
    }
    this.setState({ recip_warnmsg: '' });
  }
  onSelectOccasion = (value) => {
    this.setState({ selOccasion: value });
    if (value !== undefined) {
      this.state.selDate = null;
      this.props.form.setFieldsValue({
        schedule_date: null,
      }, () => console.log(''));
    }
  }
  onCheckSaved = (e) => {
    var checkSave = e.target.checked ? 1 : 0;
    this.setState({ checkSave });
  }
  onChangeDatePicker = (value) => {
    this.state.selDate = value;
  }
  prevRecipient = () => {
    if (this.state.currentRecipient !== 0) {
      this.state.currentRecipient = this.state.currentRecipient - 1;
      this.onSelectLocation(this.state.selectedLocation);
    }
  }

  nextRecipient = () => {
    if (this.state.currentRecipient !== this.props.order.recipients.length - 1) {
      this.state.currentRecipient = this.state.currentRecipient + 1;
      this.onSelectLocation(this.state.selectedLocation);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { order, user } = this.props;
    if (order === null || order.recipients_count === null || order.recipients_count <= 0) {
      message.warn('This order have no any recipient.');
      return;
    }
    const owner = user.account_type == INDIVIDUAL_ACCOUNT || user.is_team_owner == true;

    if (user && user.budget && user.budget.remaining_budget && parseFloat(order.total) <= parseFloat(user.budget.remaining_budget) || owner) {
      this.setState({ disableSubmit: true })
      this.props.form.validateFields((err, values) => {
        if (!err) {
          var jsonData = {
            selectedLocation: this.state.selectedLocation,
            selOccasion: this.state.selOccasion,
            selDate: this.state.selDate,
            contact: this.state.contact,
            checkSave: this.state.checkSave,
            bundleName: this.props.form.getFieldValue('title')
          }
          localStorage.setItem(ORDER_CONFIRM_STATE, JSON.stringify(jsonData));
          this.props.submitShipping(values, parseFloat(order.total), () => this.setState({ disableSubmit: false }))
        } else {
          this.setState({ disableSubmit: false })
        }
      })
    } else {
      message.warn("Insufficient budget available");
    }
  }
  handleEditorChange(content) {
    this.setState({ content });
  }
  render() {
    const { currentRecipient, order, disableSubmit, contact, selOccasion, checkSave, selectedLocation } = this.state
    const { flowIndex, bundle, occasion, intl, deliveryLocations, deliveryLocation, deliveryOccations, deliveryTime, cardSize, newrecipient, saved, removeRecipientsOrder, orientation, flow, user, shipping_cost, applycouponTotal } = this.props
    const { getFieldDecorator } = this.props.form
    const showDescription = order && order.items.gifts[0] && order.items.gifts[0].gift.description && order.donation && order.donation.organization.description ? true : false;


    const w = cardSize ? cardSize.width : 100
    const h = cardSize ? cardSize.height : 100

    const cardWidth = orientation && orientation == 'l' ? Math.max(h, w) : Math.min(h, w);
    const cardHeight = orientation && orientation == 'l' ? Math.min(h, w) : Math.max(h, w);

    const specialDate = (newrecipient && newrecipient.dob) || deliveryTime;

    const html = this.tinymce && this.tinymce.editor && this.tinymce.editor.getContent();

    let self = this;
    return order ? (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <Loader loaded={shipping_cost ? true : false}>
            <OrderItems
              {...this.props}
              {...order}
              gifts={order && order.items && order.items.gifts ? order.items.gifts : []}
              gift={order.items.gifts[0] && order.items.gifts[0].gift}
              card={order.items.card}
            />
            <div className={s.orderDetails}>

              <h3 className={s.warnText}>{this.state.loadingEditor && (html === null || html === '' || html === undefined) && intl.formatMessage(messages.personalizedmsg)}</h3>
              {this.state.mounted && bundle && <Editor
                ref={editor => {
                  this.tinymce = editor
                }}
                value={this.state.content.replace('<!doctype html>', '')}
                init={{
                  toolbar: false,
                  menubar: false,
                  statusbar: false,
                  width: `${cardWidth}mm`,
                  height: `${cardHeight}mm`,
                  content_css: [...this.state.fontlink, '/styles/tinymce.css'],
                  readonly: true,
                  setup: function (ed) {
                    ed.on('init', function (e) {
                      self.setState({loadingEditor:true});
                    });
                  }
                }}
                onEditorChange={this.handleEditorChange}
              />
              }
            </div>
            <Row type='flex' align='center' gutter={20} className={s.subtotalSection}>
              <Col xs={12}>
                <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.subtotal)}</h2>
              </Col>
              <Col xs={12}>
                <span className={s.subtotalValue}>{(order.bundle_total * order.recipients_count).toFixed(2)}</span>
                <span className={s.subtotalCurrency}>{'CHF'}</span>
              </Col>
            </Row>
            {/*
            <Row type='flex' align='center' gutter={20} className={s.totalSection}>
              <Col xs={12}>
                <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.tax)}</h2>
              </Col>
              <Col xs={12}>
                <span className={s.subtotalValue}>{order.bundle_tax}</span>
                <span className={s.subtotalCurrency}>{'CHF'}</span>
              </Col>
            </Row>
            */}
            {
              shipping_cost &&
              <Row type='flex' align='center' gutter={20} className={s.totalSection}>
                <Col xs={12}>
                  <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.shippingcost)}</h2>
                </Col>
                <Col xs={12}>
                  <span className={s.subtotalValue}>{shipping_cost.shipping_cost}</span>
                  <span className={s.subtotalCurrency}>{'CHF'}</span>
                </Col>
              </Row>
            }
            {
              shipping_cost &&
              <Row type='flex' align='center' gutter={20} className={s.totalSection}>
                <Col xs={12}>
                  <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.total)}</h2>
                </Col>
                <Col xs={12}>
                  <span className={s.subtotalValue}>{shipping_cost.total_with_tax}</span>
                  <span className={s.subtotalCurrency}>{'CHF'}</span>
                </Col>
              </Row>
            }
            {
              user && user.account_type === TEAM_ACCOUNT && !user.is_team_owner &&
              <Row type='flex' align='center' gutter={20} className={s.totalSection}>
                <Col xs={12}>
                  <h2 className={s.subtotalHeader}>{'AVAILABLE BUDGET:'}</h2>
                </Col>
                <Col xs={12}>
                  <span className={s.subtotalValue}>{user && user.budget && user.budget.remaining_budget ? user.budget.remaining_budget : '0'}</span>
                  <span className={s.subtotalCurrency}>{'CHF'}</span>
                </Col>
              </Row>
            }
            {
              order.coupon && order.coupon.value &&
              <Row type='flex' align='center' gutter={20} className={s.totalSection}>
                <Col xs={12}>
                  <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.coupon)}</h2>
                </Col>
                <Col xs={12}>
                  <span className={s.subtotalValue}>{order.coupon.value}</span>
                  <span className={s.subtotalCurrency}>{'CHF'}</span>
                </Col>
              </Row>
            }
            <Row type='flex' align='center' gutter={20} className={s.totalSection}>
              <Col xs={12}>
                <FloatingLabel placeholder={intl.formatMessage(messages.coupon)} value={this.state.couple} onChange={(e) => this.setState({ couple: e.target.value })} />
              </Col>
              <Col xs={12}>
                <Button type='primary' size='small' style={{ marginRight: 10, marginTop: 25 }} ghost onClick={() => {
                  if (this.state.couple && this.state.couple.length > 0)
                    applycouponTotal(this.state.couple)
                }}>
                  {intl.formatMessage(messages.applycoupon)}
                </Button>
              </Col>
            </Row>

            <section className={s.section}>
              <h2 className={s.sectionHeader}>{intl.formatMessage(messages.shipping)}</h2>
              {
                <Row type='flex' align='center' gutter={20} className={s.recipientSection}>
                  <Col xs={12}>
                    <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.recipients)}</h2>
                  </Col>
                  <Col xs={12}>
                    <span className={s.subtotalValue}>{order.recipients_count}</span>
                  </Col>
                </Row>
              }
              {
                this.state.recip_warnmsg && this.state.recip_warnmsg !== '' &&
                <h3 className={s.warnText}>{this.state.recip_warnmsg}</h3>
              }
              <Row gutter={20} type='flex' align='flex-start'>
                <Col xs={24} sm={8}>
                  <Form.Item>
                    {getFieldDecorator('deliverable', {
                      initialValue: this.state.selectedLocation,
                      rules: [
                        { required: true, message: intl.formatMessage(formMessages.required) },
                      ],
                    })(
                      <Select
                        placeholder={intl.formatMessage(messages.deliveryPlace)}
                        className={s.select}
                        onChange={this.onSelectLocation}
                      >
                        {deliveryLocations && deliveryLocations.map((item) =>
                          <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                  <div className={s.recipients}>
                    {contact && (
                      <div className={s.recipient}>
                        <div>{contact && contact.title ? contact.title : ' '}</div>
                        <div>{`${contact && contact.first_name ? contact.first_name : ' '} ${contact && contact.last_name ? contact.last_name : ' '}`}</div>
                        <div>{contact ? contact.address : " "/*order.recipients[currentRecipient].receiving_address.address*/}</div>
                        <div>{`${contact && contact.postal_code ? contact.postal_code : " "/*order.recipients[currentRecipient].receiving_address.postal_code*/} ${contact && contact.city ? contact.city : " "/*order.recipients[currentRecipient].receiving_address.city*/}`}</div>
                        <div>{contact ? contact.country : " "/*order.recipients[currentRecipient].receiving_address.country*/}</div>
                      </div>
                    )}
                    {selectedLocation !== 'shipping' && order.recipients && order.recipients.length > 1 && (
                      <div style={{ marginTop: 10 }}>
                        <Button
                          type='primary'
                          onClick={this.prevRecipient}
                          size='small'
                          ghost
                        >
                          prev
                      </Button>
                        <Button
                          type='primary'
                          onClick={this.nextRecipient}
                          size='small'
                        >
                          next
                      </Button>

                      </div>
                    )}
                  </div>
                </Col>
                {
                  deliveryOccations && deliveryOccations.length > 0 &&
                  <Col xs={24} sm={8}>
                    <Form.Item>
                      {getFieldDecorator('delivery_occasion', {
                        initialValue: this.state.selOccasion || undefined,
                        rules: [
                          { required: false, message: intl.formatMessage(formMessages.required) },
                        ],
                      })(
                        <Select
                          allowClear={true}
                          disabled={deliveryOccations && deliveryOccations.length > 0 ? false : true}
                          showArrow={deliveryOccations && deliveryOccations.length > 0 ? true : false}
                          placeholder={intl.formatMessage(messages.deliveryOccasion)}
                          className={s.select}
                          onChange={this.onSelectOccasion}>
                          {deliveryOccations && deliveryOccations.map((item) =>
                            <Select.Option key={item} value={item}>{item}</Select.Option>
                          )}
                        </Select>
                      )}
                    </Form.Item>
                    <div>
                      {intl.formatMessage(messages.deliveryOccasion_text)}
                    </div>
                  </Col>
                }
                <Col xs={24} sm={8}>
                  {
                    !(selOccasion && selOccasion.length > 0) &&
                    <div>
                      <Form.Item>
                        {getFieldDecorator('schedule_date', {
                          initialValue: specialDate ? moment(specialDate, DATE_FORMAT) : undefined,
                        })(
                          <DatePicker
                            ref={ref => this.datePicker = ref}
                            className={s.select}
                            placeholder={intl.formatMessage(messages.deliveryTime)}
                            format={DISPLAYED_DATE_FORMAT}
                            disabled={selOccasion && selOccasion.length > 0 ? true : false}
                            disabledDate={current => {
                              var date = new Date();
                              let zurichtime = moment().tz("Europe/Zurich").format('HH');
                              if (parseInt(zurichtime) < 12) {
                                date.setDate(date.getDate() + 3);
                              }
                              else date.setDate(date.getDate() + 4);

                              return current && current.valueOf() < (date)
                            }}
                            onChange={this.onChangeDatePicker}
                          />
                        )}
                      </Form.Item>
                      <div>
                        {intl.formatMessage(messages.deliveryDate_text)}
                      </div>
                    </div>
                  }
                </Col>
              </Row>
              {
                    selectedLocation !== 'shipping' &&
                    <div style={{ marginTop: 20 }}>
                      <Button type='primary' size='small' style={{ marginRight: 10 }} ghost onClick={() => {
                        this.props.toAddContactFlowStep();
                      }}>
                        <PlusIcon />
                        {intl.formatMessage(messages.add)}
                      </Button>

                      <Popconfirm
                        title={intl.formatMessage(messages.confirmRemoving)}
                        onConfirm={() => {
                          removeRecipientsOrder(order.recipients[currentRecipient].id)
                          this.setState({ currentRecipient: 0 });
                        }}
                        okText={intl.formatMessage(messages.acceptRemoving)}
                      >
                        <Button type='primary' size='small' ghost >
                          <RemoveIcon />
                          {intl.formatMessage(messages.remove)}
                        </Button>
                      </Popconfirm>
                    </div>
                  }
              {/*
                <Row type='flex' align='center' gutter={20} className={s.totalSection}>
                  <Col xs={12}>
                    {
                      flow.key !== ORDER_BUNDLE_FLOW.key && flow.key !== ORDER_VOUCHER_FLOW.key &&
                      <div>
                        <Form.Item>
                          {getFieldDecorator('saved', {
                            initialValue: saved === 1 || this.state.checkSave === 1 ? true : false,
                            valuePropName: 'checked',
                          })(
                            <Checkbox onChange={this.onCheckSaved}>{intl.formatMessage(messages.saveasbundle)}</Checkbox>
                          )}
                        </Form.Item>
                        {
                          this.state.checkSave === 1 &&
                          <Form.Item>
                            {getFieldDecorator('title', {
                              initialValue: this.state.bundleName,
                              rules: [
                                { required: this.state.checkSave === 1 ? true : false, min: this.state.checkSave === 1 ? 5 : 0, message: intl.formatMessage(formMessages.minLength, { length: 5 }) },
                              ],
                            })(
                              <FloatingLabel placeholder={intl.formatMessage(messages.bundleName) + ' *'} />
                            )}
                          </Form.Item>
                        }
                      </div>
                    }
                  </Col>
                </Row>
            */}
            </section>
          </Loader>
        </div>
        <PurchaseActions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => { !disableSubmit && this.handleSubmit && shipping_cost }}
          />
          <Button
            type='primary'
            htmlType='submit'
            disabled={disableSubmit || shipping_cost === null}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
      </Form>
    ) : null
  }
}

const mapState = state => ({
  loading: state.purchase.loading,
  flow: state.purchase.flow,
  flowIndex: state.purchase.flowIndex,
  bundle: state.purchase.bundle,
  order: state.purchase.order,
  occasion: state.purchase.occasion,
  deliveryLocations: state.purchase.deliveryLocations,
  deliveryLocation: state.purchase.deliveryLocation,
  deliveryTime: state.purchase.deliveryTime,
  cardSize: state.purchase.cardSize,
  cardDetails: state.purchase.cardDetails,
  newrecipient: state.purchase.newrecipient,
  deliveryOccations: state.purchase.deliveryOccations,
  user: state.user.user,
  orientation: state.purchase.orientation,
  shipping_cost: state.purchase.shipping_cost
})

const mapDispatch = {
  submitShipping,
  removeRecipientsOrder,
  toAddContactFlowStep,
  removeDontationFromBundle,
  removeVoucherFromBundle,
  syncGifts_Bundle,
  recalculateTotal,
  applycouponTotal
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Purchase11)))
