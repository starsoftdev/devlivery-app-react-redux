import React from 'react'
import {connect} from 'react-redux'
import {submitShipping} from '../../reducers/purchase'
import {Button, Col, DatePicker, Form, Row, Select, message, Checkbox, Input} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase11.css'
import {OrderItems, PurchaseActions, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import formMessages from '../../formMessages'
import messages from './messages'
import {DATE_FORMAT, DISPLAYED_DATE_FORMAT} from '../../constants'
import moment from 'moment'

import { Editor } from '@tinymce/tinymce-react';
import * as Contants from '../../constants';
import { injectGlobal } from 'styled-components';

injectGlobal`
  .mce-notification-warning{
    display: none !important;
  }
  iframe {overflow:hidden;}
  .mceContentBody{
    overflow-y:hidden !important;
  }
`

class Purchase11 extends React.Component {
  // TODO refactor and reuse code from OrderDetails.js
  constructor(props) {
    super(props)
    this.state = {
      currentRecipient: 0,
      mounted: false,
      content:'',
      fontlink:[],
      order: props.order,
      disableSubmit:false,
      selectedLocation:'shipping',
      selOccasion:null,
      selDate:(props.newrecipient && props.newrecipient.dob) || props.deliveryTime,
      contact:null,
      checkSave: props.saved || 0
    }
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.onCheckSaved = this.onCheckSaved.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps && nextProps.bundle)
    {
      this.setState({content:nextProps.bundle.body ?nextProps.bundle.body:'', order:nextProps.order});
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
  }
  onSelectLocation = (value) =>{
    const {order,currentRecipient,selectedLocation} = this.state;
    if(value === 'shipping')
    {
      const {user} = this.props;
      const address = user && user.addresses && user.addresses.find(item => item.default !== null)
      
      this.setState({selectedLocation:value, contact:{...address,...user}});
      return ;
    }
    else if(order && order.recipients && order.recipients[currentRecipient])
    {
      var selRecipient = order.recipients[currentRecipient];
      const filter_contact =  selRecipient.contact.addresses.filter(item => item.title === value);
      
      
      if(filter_contact)
      {
        const contact = filter_contact.length > 0 ? filter_contact[0]: null;
        this.setState({selectedLocation:value, contact:{...contact, ...selRecipient.contact}});
      }
      else this.setState({selectedLocation:value, contact:null});
    }
    else this.setState({...this.state});
  }
  onSelectOccasion = (value) =>{
    this.setState({selOccasion:value});
    if(value !== undefined)
    {
      this.state.selDate = null;
      this.props.form.setFieldsValue({
        schedule_date: null,
      }, () => console.log('after'));
    }
  }
  onCheckSaved = (e) => {
    var checkSave = e.target.checked ? 1:0;
    this.setState({checkSave});
  }
  onChangeDatePicker = (value) =>{
    this.state.selDate = value;
  }
  prevRecipient = () => {
    if(this.state.currentRecipient !== 0) {
      this.state.currentRecipient = this.state.currentRecipient - 1;
      this.onSelectLocation(this.state.selectedLocation);
    }
  }

  nextRecipient = () => {
    if(this.state.currentRecipient !== this.props.order.recipients.length - 1) {
      this.state.currentRecipient = this.state.currentRecipient + 1;
      this.onSelectLocation(this.state.selectedLocation);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({disableSubmit:true})
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitShipping(values)
      }else{
        this.setState({disableSubmit:false})
      }
    })
  }
  handleEditorChange(content) {
    this.setState({ content });
  }
  render() {
    const {currentRecipient,order,disableSubmit, contact, selOccasion,checkSave} = this.state
    const {flowIndex, bundle, occasion, intl, deliveryLocations, deliveryLocation, deliveryOccations, deliveryTime, cardSize, newrecipient, saved} = this.props
    const {getFieldDecorator} = this.props.form
    const showDescription = order && order.items.gifts[0] && order.items.gifts[0].gift.description && order.donation && order.donation.organization.description ? true : false;
    const cardWidth = cardSize ? cardSize.width : 100
    const cardHeight = cardSize ? cardSize.height : 100
    
    const specialDate = (newrecipient && newrecipient.dob) || deliveryTime;
    
    return order ? (
      <Form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <OrderItems {...order} gift={order.items.gifts[0] && order.items.gifts[0].gift} card={order.items.card}/>
          <div className={s.orderDetails}>
            <h3 className={s.cardTitle}>{occasion && occasion.title}</h3>
            {this.state.mounted && bundle && <Editor
                    value={this.state.content} 
                    init={{
                      toolbar: false,
                      menubar:false,
                      statusbar: false,
                      width: `${cardWidth}mm`,
                      height: `${cardHeight}mm`,
                      content_css : [...this.state.fontlink, '/styles/tinymce.css'],
                      readonly: true
                    }}
                    onEditorChange={this.handleEditorChange} 
                  />
            }
            {
              /*
              showDescription &&
              <Row type='flex' align='center' gutter={20}>
                <Col xs={24} sm={24}>
                <section>
                  <h5 className={s.cardTitle} style={{'margin-top':20}}>{order.items.gifts[0] && order.items.gifts[0].gift.description}</h5>
                  {order.donation && order.donation.organization.description}
                </section>
                </Col>
              </Row>
              */
            }
          </div>
          <Row type='flex' align='center' gutter={20} className={s.subtotalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.subtotal)}</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>{order.subtotal}</span>
              <span className={s.subtotalCurrency}>{'CHF'}</span>
            </Col>
          </Row>
          <Row type='flex' align='center' gutter={20} className={s.totalSection}>
            <Col xs={12}>
              <h2 className={s.subtotalHeader}>{intl.formatMessage(messages.total)}</h2>
            </Col>
            <Col xs={12}>
              <span className={s.subtotalValue}>{order.total}</span>
              <span className={s.subtotalCurrency}>{'CHF'}</span>
            </Col>
          </Row>
          <section className={s.section}>
            <h2 className={s.sectionHeader}>{intl.formatMessage(messages.shipping)}</h2>
            <Row gutter={20} type='flex' align='center'>
              <Col xs={24} sm={8}>
                <Form.Item>
                  {getFieldDecorator('deliverable', {
                    initialValue: undefined,
                    rules: [
                      {required: true, message: intl.formatMessage(formMessages.required)},
                    ],
                  })(
                    <Select 
                      placeholder={intl.formatMessage(messages.deliveryPlace)} 
                      className={s.select}
                      onChange ={this.onSelectLocation}
                      >
                      {deliveryLocations && deliveryLocations.map((item) =>
                        <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item>
                  {getFieldDecorator('delivery_occasion', {
                    initialValue: undefined,
                    rules: [
                      {required: false, message: intl.formatMessage(formMessages.required)},
                    ],
                  })(
                    <Select 
                      allowClear ={true} 
                      placeholder={intl.formatMessage(messages.deliveryOccasion)} 
                      className={s.select}
                      onChange ={this.onSelectOccasion}>
                      {deliveryOccations && deliveryOccations.map((item) =>
                        <Select.Option key={item} value={item}>{item}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item>
                  {getFieldDecorator('schedule_date', {
                    initialValue: specialDate ? moment(specialDate, DATE_FORMAT) : undefined,
                  })(
                    <DatePicker
                      ref ={ref =>this.datePicker = ref}
                      className={s.select}
                      placeholder={intl.formatMessage(messages.deliveryTime)}
                      format={DISPLAYED_DATE_FORMAT}
                      disabled = {selOccasion && selOccasion.length > 0 ? true : false}
                      disabledDate ={current =>{
                        var date = new Date();
                        date.setDate(date.getDate() - 1);
                        return current && current.valueOf() < (date)
                      }}
                      onChange = {this.onChangeDatePicker}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row type='flex' align='center' gutter={20} className={s.totalSection}>
              <Col xs={12}>
                <div className={s.recipients}>
                  {order.recipients[currentRecipient] && (
                    <div className={s.recipient}>
                      <div>{contact && contact.title ? contact.title :''}</div>
                      <div>{`${contact && contact.first_name ? contact.first_name:''} ${contact && contact.last_name ? contact.last_name:''}`}</div>
                      <div>{contact? contact.address :""/*order.recipients[currentRecipient].receiving_address.address*/}</div>
                      <div>{`${contact && contact.postal_code? contact.postal_code :""/*order.recipients[currentRecipient].receiving_address.postal_code*/} ${contact && contact.city? contact.city :""/*order.recipients[currentRecipient].receiving_address.city*/}`}</div>
                      <div>{contact? contact.country :""/*order.recipients[currentRecipient].receiving_address.country*/}</div>
                    </div>
                  )}
                  {order.recipients.length > 1 && (
                    <div>
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
              <Col xs={12}>
                <Form.Item>
                  {getFieldDecorator('saved', {
                    initialValue: saved,
                  })(
                    <Checkbox onChange={this.onCheckSaved}>Save order as bundle</Checkbox>
                  )}
                </Form.Item>
                {
                  this.state.checkSave === 1 &&
                  <Form.Item>
                    {getFieldDecorator('title', {
                      initialValue: '',
                      rules: [
                        {required: this.state.checkSave === 1 ? true : false, min: this.state.checkSave === 1 ? 5:0, message: intl.formatMessage(formMessages.minLength, {length: 5})},
                      ],
                    })(
                      <Input placeholder={'Bundle Name *'}/>
                    )}
                  </Form.Item>
                }
              </Col>
            </Row>
            
          </section>
        </div>
        <PurchaseActions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => {!disableSubmit && this.handleSubmit}}
          />
          <Button
            type='primary'
            htmlType='submit'
            disabled={disableSubmit}
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
  user: state.user.user
})

const mapDispatch = {
  submitShipping,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Purchase11)))
