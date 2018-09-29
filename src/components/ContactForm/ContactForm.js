import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactForm.css'
import {Col, DatePicker, Input, Row, Select, Form} from 'antd'
import formMessages from '../../formMessages'
import {DATE_FORMAT, DISPLAYED_DATE_FORMAT} from '../../constants'
import {Address} from '../../components'
import messages from './messages'
import {injectIntl} from 'react-intl'
import Reminders from './Reminders'
import Groups from './Groups'
import moment from 'moment'
import {FloatingLabel} from '../../components';

const SALUTATIONS = ['Mr.', 'Ms.', 'Dr.','Family']

const RELATIONSHIP = [
  'Mother',
  'Father',
  'Brother',
  'Sister',
  'Son',
  'Daughter',
  'Child',
  'Friend',
  'Spouse',
  'Partner',
  'Assistant',
  'Manager',
  'Other',
]

class ContactForm extends React.Component {
  constructor(props)
  {
    super(props)
    var salutations_list = SALUTATIONS.map(item => {
      return {
        id:item, 
        value:props.intl.formatMessage(messages['salt_'+item.toLowerCase().substring(0,item.length-1)])
      }
    });
    //if(salutations_list[1].value === salutations_list[2].value)
      //delete salutations_list[2];

    this.state = {
      requiredAddress: props.initRequiredAddress?props.initRequiredAddress:-1,
      relationshipName: null,
      newRelationship: null,
      salutations_list,
      collapseActiveIndex:null
    }
    this.onExpand = this.onExpand.bind(this);
  }
  addRelationship = (relationshipName) => {
    this.setState({
      newRelationship: relationshipName,
      relationshipName: null,
    })
  }
  onExpand(index,keyevent){
    if(index !== null)
    {
      if(keyevent)
      {
        this.setState({collapseActiveIndex:index ===0 ? 1:null});
      }
      else this.setState({collapseActiveIndex:index !== this.state.collapseActiveIndex?index:null});
    }
  }

  // TODO find a better way to set at least one address required
  changeRequiredAddress = (index, value) => {
    
    let requiredAddress = index
    /*
    if (!value && index === 1) {
      requiredAddress = 0
    } else if (!value && index === 0) {
      requiredAddress = 1
    }
    */
    if(value)
      this.setState({requiredAddress})
  }

  render() {
    const {requiredAddress, relationshipName, newRelationship} = this.state
    const {intl, children, header, initialValues} = this.props
    const {getFieldDecorator} = this.props.form

    let relationshipList = [...RELATIONSHIP]

    if (newRelationship && !relationshipName) {
      relationshipList = [newRelationship, ...RELATIONSHIP.filter(item => item !== newRelationship)]
    }
    
    const contactSection = (
      <section className={s.section}>
        {header && <h1 className={s.header}>{header}</h1>}
        <Form.Item>
          {getFieldDecorator('contact.title', {
            initialValue: initialValues && initialValues.title ? initialValues.title : undefined,
          })(
            <Select placeholder={intl.formatMessage(messages.salutation)}>
              {this.state.salutations_list.map((item) =>
                <Select.Option key={item.id} value={item.id}>{item.value}</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        <Row gutter={20}>
          <Col xs={24} sm={12}>
            <Form.Item>
              {getFieldDecorator('contact.first_name', {
                initialValue: initialValues && initialValues.first_name,
                rules: [
                  {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.firstName)+ " *"}/>
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item>
              {getFieldDecorator('contact.last_name', {
                initialValue: initialValues && initialValues.last_name,
                rules: [
                  {required: true, message: intl.formatMessage(formMessages.required), whitespace: true},
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.lastName)+ " *"}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          {getFieldDecorator('contact.email', {
            validateTrigger: 'onSubmit',//'onBlur'
            initialValue: initialValues && initialValues.email,
            rules: [
              {required: false, message: intl.formatMessage(formMessages.required)},
            ],
          })(
            <FloatingLabel placeholder={intl.formatMessage(messages.email)+ " *"}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('contact.phone', {
            initialValue: initialValues && initialValues.phone,
            rules: [
              {required: false, message: intl.formatMessage(formMessages.required)},
            ],
          })(
            <FloatingLabel placeholder={intl.formatMessage(messages.phone)+ " *"}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('contact.nickname', {
            initialValue: initialValues && initialValues.nickname,
          })(
            <FloatingLabel placeholder={intl.formatMessage(messages.nickname)}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('contact.relationship', {
            initialValue: initialValues && initialValues.relationship ? initialValues.relationship : undefined,
          })(
            <Select
              showSearch
              allowClear
              placeholder={intl.formatMessage(messages.relationship)}
              filterOption={false}
              onSearch={(search) => {
                this.setState({relationshipName: search})
              }}
              onChange={(value, item) => {
                if (item && +item.key === 0) {
                  this.addRelationship(relationshipName)
                }
              }}
            >
              {relationshipName && !relationshipList.find(item => item === relationshipName) && (
                <Select.Option key={0} value={relationshipName}>+ Add "{relationshipName}"</Select.Option>
              )}
              {relationshipList.map((item, i) =>
                <Select.Option key={i + 1} value={item}>{item}</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
      </section>
    )

    const birthdaySection = (
      <section className={s.section}>
        <h1 className={s.header}>{intl.formatMessage(messages.birthday)}</h1>
        <Form.Item>
          {getFieldDecorator('dob', {
            initialValue: initialValues && initialValues.dob ? moment(initialValues.dob, DATE_FORMAT) : undefined,
          })(
            <DatePicker className={s.birthday} format={DISPLAYED_DATE_FORMAT}/>
          )}
        </Form.Item>
      </section>
    )

    const homeAddressSection = (
      <Address
        title='home'
        required={requiredAddress === 0}
        onAddressChange={(value) => this.changeRequiredAddress(0, value)}
        header={intl.formatMessage(messages.homeAddress)}
        form = {this.props.form}
        getFieldDecorator={getFieldDecorator}
        index={0}
        intl={intl}
        initialValues={initialValues && initialValues.addresses? initialValues.addresses.find(item => item.title === 'home' || item.title === null) : null}
        collapseActiveIndex = {this.state.collapseActiveIndex}
        onExpand = {this.onExpand}
      />
    )

    const companyAddressSection = (
      <Address
        title='office'
        required={requiredAddress === 1}
        onAddressChange={(value) => this.changeRequiredAddress(1, value)}
        header={intl.formatMessage(messages.companyAddress)}
        form = {this.props.form}
        getFieldDecorator={getFieldDecorator}
        index={1}
        intl={intl}
        initialValues={initialValues && initialValues.addresses? initialValues.addresses.find(item => item.title === 'office') : null}
        collapseActiveIndex = {this.state.collapseActiveIndex}
        onExpand = {this.onExpand}
      />
    )

    const remindersSection = (
      <section className={s.section}>
        <h1 className={s.header}>{intl.formatMessage(messages.reminders)}</h1>
        <Reminders form={this.props.form} intl={intl} initialValues={initialValues ? initialValues.reminders : null}/>
      </section>
    )

    const groupsSection = (
      <section className={s.section}>
        <h1 className={s.header}>{intl.formatMessage(messages.groups)}</h1>
        <Groups form={this.props.form} intl={intl} initialValues={initialValues ? initialValues.groups : null}/>
      </section>
    )

    return children({
      contactSection,
      birthdaySection,
      homeAddressSection,
      companyAddressSection,
      remindersSection,
      groupsSection,
    })
  }
}

export default injectIntl(withStyles(s)(ContactForm))
