import React from 'react'
import { Button, DatePicker, Form, Icon, Input, Select, Row, Col, Popconfirm } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Reminders.css'
import PlusIcon from '../../static/plus.svg'
import { DATE_FORMAT, DEFAULT_DEBOUNCE_TIME, DISPLAYED_DATE_FORMAT } from '../../constants'
import { connect } from 'react-redux'
import { getOccasions, getReminderDate } from '../../reducers/contacts'
import debounce from 'lodash/debounce'
import messages from './messages'
import moment from 'moment-timezone'
import { createArray } from '../../utils'
import formMessages from '../../formMessages'
import { BIRTH_GERMAN, BIRTH_EN } from '../../constants'
import cn from 'classnames'
import EditIcon from '../../static/edit.svg'
import { Link } from '../'
import { InputDate } from '../../components';
import { cloneDeep, isUndefined } from 'lodash';
import isEmpty from 'lodash/isEmpty'

class ReminderCard extends React.Component {
  render() {
    const {k, index, reminder, intl, occasion,Reminder_recurring, removeItem, editItem, editable} = this.props;
    const recurring  = Reminder_recurring.find(item => item.value === reminder.recurring);
    
    if(reminder.date === undefined || reminder.reminder_date === undefined || reminder.date === null || reminder.reminder_date === null)
      return <div/>;
    return (
      <div className={s.carditem}>
        {
          editable !== false &&
          <div
            className={s.gridEditBtn}
            onClick={() => editItem(k)}
          >
            <EditIcon />
          </div>
        }
        <Row>
          <Col xs={10}><div className={s.info_item}>{intl.formatMessage(messages.reminderFor)}</div></Col>
          <Col xs={14}><div className={s.info_item}>{occasion}</div></Col>
        </Row>
        <Row>
          <Col xs={10}><div className={s.info_item}>{intl.formatMessage(messages.occasionDate)}</div></Col>
          <Col xs={14}><div className={s.info_item}>{reminder.date ? reminder.date:''}</div></Col>
        </Row>
        <Row>
          <Col xs={10}><div className={s.info_item}>{intl.formatMessage(messages.reminderDate)}</div></Col>
          <Col xs={14}><div className={s.info_item}>{reminder.reminder_date}</div></Col>
        </Row>
        <Row>
          <Col xs={10}><div className={s.info_item}>{intl.formatMessage(messages.frequency)}</div></Col>
          <Col xs={14}><div className={s.info_item}>{recurring ? recurring.label : Reminder_recurring[0].label}</div></Col>
        </Row>
        {
          editable !== false &&
          <div className={s.removeIcon}>
            <Popconfirm
              title={intl.formatMessage(messages.deleteReminderMessage)}
              onConfirm={() => removeItem(k)}
              okText={intl.formatMessage(messages.deleteReminderYes)}
            >
              <Icon type='close' />
            </Popconfirm>
          </div>
        }
      </div>
    )
  }
}

class Reminders extends React.Component {
  uuid = 1

  constructor(props) {
    super(props)

    this.state = {
      occasionTitle: null,
      newOccasion: null,
      isAdding: false,
      isEditing: false,
      editIndex: 0,
      InvalidIndex: null,
      errorMessage: null,
      visible: false,
    }

    this.getOccasions = debounce(props.getOccasions, DEFAULT_DEBOUNCE_TIME)
    this.changeDatePicker = this.changeDatePicker.bind(this);
    this.changeRecurring = this.changeRecurring.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.editItem = this.editItem.bind(this);
  }

  componentWillMount() {
    this.props.getOccasions()
  }

  componentDidMount() {
    const { initialValues } = this.props
    this.uuid = initialValues && initialValues.length ? initialValues.length : 1
    if(initialValues == null || (initialValues && initialValues.length && initialValues.length <= 0))
      this.setState({isAdding:true});
  }

  addOccasion = (occasionTitle) => {
    this.setState({
      newOccasion: occasionTitle,
      occasionTitle: null,
    })
  }
  editItem = (k) => {
    this.setState({editIndex: k, isEditing: true, isAdding: false});
  }
  removeItem = (k) => {
    const keys = this.props.form.getFieldValue('reminderKeys')
    const newKeys = keys.filter(key => key !== k)
    this.props.form.setFieldsValue({ reminderKeys: newKeys })
    this.setState({ visible: false });
  }
  saveItem = (k) => {
    if(!this.isValidateReminder(k))
      return;
    this.setState({isEditing: false});
  }
  addItem = () => {
    const keys = this.props.form.getFieldValue('reminderKeys')
    
    if(this.state.isAdding)
    {
      if(!this.isValidateReminder(keys[keys.length-1]))
        return false;
      this.setState({isAdding: false, isEditing: false});
      return true;
    }
    
    const newKeys = keys.concat(this.uuid)
    this.uuid++
    this.props.form.setFieldsValue({ reminderKeys: newKeys })
    this.setState({isAdding:true, isEditing: false});
    return true;
  }
  isValidateReminder = (k) =>{
    const {reminder_date, occasion_id, recurring} = this.props.form.getFieldValue(`reminders[${k}]`)
    if(this.state.errorMessage)
      return false;
    if(occasion_id === null || 
      occasion_id === undefined || 
      reminder_date === null || 
      reminder_date === undefined || 
      recurring === undefined || 
      recurring === null)
    {
      var errMessage = (occasion_id === null || occasion_id === undefined) ? this.props.intl.formatMessage(messages.requirOccasion) :
                       (reminder_date === null || reminder_date === undefined) ? this.props.intl.formatMessage(messages.requirOccasion) :
                       (recurring === null || recurring === undefined) ? this.props.intl.formatMessage(messages.requireRecurring) : this.props.intl.formatMessage(messages.requireNotOnce);
      this.setState({InvalidIndex:k, errorMessage:errMessage});
      return false;
    }
    this.setState({InvalidIndex:null});
    return true;
  }
  validateMinLength = (rule, value, callback) => {
    const { intl } = this.props
    // user can select occasion id or type custom title (which needs to validated)
    if (value && isNaN(+value) && value.length < 3) {
      callback(intl.formatMessage(formMessages.minLength, { length: 3 }))
    } else {
      callback()
    }
  }
  getReminderRecurring(occasionId) {
    let Reminder_recurring = [
      { value: '1', label: this.props.intl.locale === 'de-DE' ? 'Einmal' : 'Once' },
      { value: 'm', label: this.props.intl.locale === 'de-DE' ? 'Monatlich' : 'Every month' },
      { value: 'y', label: this.props.intl.locale === 'de-DE' ? 'Jährlich' : 'Every year' }
    ];
    if (occasionId === BIRTH_EN || occasionId === BIRTH_GERMAN) {
      Reminder_recurring.splice(1, 1);
    }
    return Reminder_recurring;
  }
  changeDatePicker = (k, value) => {
    const { getFieldValue, setFieldsValue } = this.props.form
    if(this.isValidOccasionDate(k,value.target.value))
    {
      if (value === null || getFieldValue(`reminders[${k}].recurring`) === undefined) {
        setFieldsValue({ [`reminders[${k}].reminder_date`]: null })
        return;
      }
      this.getReminderDate(k, moment(value.target.value,'DD-MM-YYYY'), getFieldValue(`reminders[${k}].recurring`));
    }
    else {
      setFieldsValue({ [`reminders[${k}].reminder_date`]: null })
    }
  }
  isValidOccasionDate(k,value){
    if(value === undefined || (value!== undefined && value.length !== 10))
    {
      this.setState({InvalidIndex:k,errorMessage:this.props.intl.formatMessage(messages.invalidoccasion)});
      return false;
    }
    const occasion_date = moment(value,'DD-MM-YYYY');
    const diff = moment().add(1, 'days').diff(occasion_date, 'days');
    if(diff > 0)
    {
      this.setState({InvalidIndex:k,errorMessage:this.props.intl.formatMessage(messages.invalidoccasion)});
      return false;
    }
    this.setState({InvalidIndex:k,errorMessage:null});
    return true
  }
  changeRecurring = (k, value) => {
    const { getFieldValue, setFieldsValue } = this.props.form
    if (value === undefined || !this.isValidOccasionDate(k,getFieldValue(`reminders[${k}].date`))) {
      setFieldsValue({ [`reminders[${k}].reminder_date`]: null })
      return;
    }
    this.getReminderDate(k, moment(getFieldValue(`reminders[${k}].date`), 'DD-MM-YYYY'), value);
  }
  getReminderDate(k, date, recurring) {
    const { getFieldValue, setFieldsValue } = this.props.form
    this.props.getReminderDate(
      date.format('YYYY-MM-DD'),
      recurring,
      (res) => {
        if (res.reminder_date) {
          setFieldsValue({ [`reminders[${k}].reminder_date`]: res.reminder_date });
        }
      }
    );
  }
  cancelEdit = () => {
    const keys = this.props.form.getFieldValue('reminderKeys')
    keys.pop();
    const newKeys = cloneDeep(keys);
    this.props.form.setFieldsValue({ reminderKeys: newKeys })
    this.setState({ isAdding: false });
  }
  render() {
    const { occasionTitle, newOccasion, isAdding } = this.state
    const { occasions, loading, intl, initialValues, form } = this.props
    const { getFieldDecorator, getFieldValue } = form

    form.getFieldDecorator('reminderKeys', { initialValue: createArray(initialValues && initialValues.length ? initialValues.length : 1) })

    let occasionsList = [...occasions]

    if (newOccasion && !occasionTitle) {
      occasionsList = [{ title: newOccasion }, ...occasions.filter(item => item.title !== newOccasion)]
    }
    const keys = getFieldValue('reminderKeys')
    
    return (
      <React.Fragment>
        {keys.map((k, i) => {
          const Reminder_recurring = this.getReminderRecurring(getFieldValue(`reminders[${k}].occasion_id`));

          let occasion = undefined;
          let occasion_title = '';
          if (initialValues && initialValues[k]) {
            if (initialValues[k].title && (initialValues[k].title.toUpperCase() === BIRTH_EN || initialValues[k].title.toUpperCase() === BIRTH_GERMAN)) {
              occasion = intl.locale === 'de-DE' ? BIRTH_GERMAN : BIRTH_EN;
              occasion_title = intl.locale === 'de-DE' ? BIRTH_GERMAN : BIRTH_EN;
            } else if (initialValues[k].occasion_id !== null) {
              occasion = initialValues[k].occasion_id + '';
              const find_occasion = occasions.find(item=> item.id === initialValues[k].occasion_id);
              occasion_title = find_occasion && find_occasion.title ? find_occasion.title : '';
              
            } else if (initialValues[k].title !== null) {
              occasion = initialValues[k].title;
              occasion_title = initialValues[k].title;
            }
          }

          if(occasion_title == '' || getFieldValue(`reminders[${k}].occasion_id`) !== initialValues[k].occasion_id) {
            const find_occasion = occasions.find(item=> item.id+'' === getFieldValue(`reminders[${k}].occasion_id`)+'');
            occasion_title = find_occasion && find_occasion.title ? find_occasion.title : getFieldValue(`reminders[${k}].occasion_id`);
          }
         
          const isAdding = this.state.isAdding && (k === (this.uuid-1));
          const isEditing = (this.state.isEditing && (k === this.state.editIndex) || isAdding);
          
          return (
            <div key={k}>
              {
                (!isEditing) &&
                <ReminderCard 
                  intl={intl} 
                  k={k} 
                  index={i} 
                  occasion = {occasion_title} 
                  reminder={getFieldValue(`reminders[${k}]`)} 
                  Reminder_recurring={Reminder_recurring} 
                  removeItem={this.removeItem} 
                  editItem={this.editItem}
                  editable = {!isEmpty(initialValues)  && initialValues[k] && initialValues[k].editable !== null ? initialValues[k].editable : true}
                />
              }
              <div className={cn(s.item, (!isEditing) && s.hiddenItem)}>
                {initialValues && initialValues[k] && initialValues[k].id && getFieldDecorator(`reminders[${k}].id`, {
                  initialValue: initialValues[k].id,
                })(
                  <Input type='hidden' />
                )}
                <Form.Item>
                  {getFieldDecorator(`reminders[${k}].occasion_id`, {
                    initialValue: occasion,
                    rules: [
                      { validator: this.validateMinLength }
                    ]
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder={intl.formatMessage(messages.occasion)}
                      notFoundContent={loading.occasions ? 'Loading...' : null}
                      filterOption={false}
                      onSearch={(search) => {
                        this.getOccasions({ search })
                        this.setState({ occasionTitle: search })
                      }}
                      onChange={(value, item) => {
                        //form.setFieldsValue({[`reminders[${k}].recurring`]: undefined});
                        if (item && +item.key !== 0) {
                          const selectedOccasion = occasions.find(occasion => occasion.id === +value)
                          //form.setFieldsValue({ [`reminders[${k}].date`]: selectedOccasion && selectedOccasion.date ? moment(selectedOccasion.date, DATE_FORMAT) : undefined })
                        }
                        if (item && +item.key === 0) {
                          this.addOccasion(occasionTitle)
                        }
                      }}
                    >
                      {occasionTitle && !occasionsList.find(item => item.title === occasionTitle) && (
                        <Select.Option key={0} value={occasionTitle}>+ Add "{occasionTitle}"</Select.Option>
                      )}
                      {!occasionTitle && initialValues && initialValues[k] && initialValues[k].occasion_id === null && initialValues[k].title && !occasionsList.find(item => item.title === initialValues[k].title) && (
                        <Select.Option key={0} value={initialValues[k].title}>{initialValues[k].title}</Select.Option>
                      )}
                      {occasionsList.map((item, i) =>
                        <Select.Option key={i + 1} value={`${item.id}`}>{item.title}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`reminders[${k}].date`, {
                    initialValue: initialValues && initialValues[k] ? initialValues[k].date : undefined,
                  })(
                    <InputDate
                      onChange={(value) => this.changeDatePicker(k, value)}
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`reminders[${k}].recurring`, {
                    initialValue: initialValues ? (initialValues[k] && initialValues[k].recurring ? initialValues[k].recurring : (initialValues[k] && initialValues[k].date ? '1':undefined)) : undefined,
                  })(
                    <Select
                      allowClear
                      placeholder={intl.formatMessage(messages.repeat)}
                      onChange={(value) => this.changeRecurring(k, value)}
                    >
                      {Reminder_recurring.map((item) =>
                        <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
                <Row>
                    <Col xs={14}>
                      <Form.Item>
                        {getFieldDecorator(`reminders[${k}].reminder_date`, {
                          initialValue: initialValues && initialValues[k] && initialValues[k].reminder_date ? initialValues[k].reminder_date : undefined,
                        })(
                          <p className={s.reminderDate}>
                            {getFieldValue(`reminders[${k}].reminder_date`) ? ('Reminder Date :  ' + getFieldValue(`reminders[${k}].reminder_date`)) : ''}
                          </p>
                        )}
                      </Form.Item>
                    </Col>
                    {
                      this.state.isEditing &&
                      <Col xs={10} style={{textAlign:'right'}}>
                        <Button type='primary' size={'small'} ghost onClick={()=>this.saveItem(k)}>
                          {intl.formatMessage(messages.save)}
                        </Button>
                      </Col>
                    }
                </Row>
                
                {
                  this.state.InvalidIndex === k &&
                  <Row>
                    <Col xs={24}><div className={s.error_item}>{this.state.errorMessage}</div></Col>
                  </Row>
                }
        
                {
                  /*
                  i > 0 && (
                  <Icon type='close' onClick={() => this.removeItem(k)} className={s.removeIcon} />
                  )
                  */
                }
              </div>
            </div>
          )
        }
        )}
        {
          !this.state.isEditing &&
          <Row>
            <Col span={12}>
              <Button type='primary' ghost onClick={this.addItem} size={!isAdding ? 'default' : 'small'}>
                <PlusIcon />
                {intl.formatMessage(!isAdding ? messages.addReminder: messages.saveReminder)}
              </Button>
            </Col>
            {isAdding &&
              <Col span={12} className={s.textAlignRight}>
                <Button type='primary' ghost onClick={this.cancelEdit} size={'small'}>
                  {intl.formatMessage(messages.cancelEdit)}
                </Button>
              </Col>
            }
          </Row>
        }
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  occasions: state.contacts.occasions,
  loading: state.contacts.loading,
})

const mapDispatch = {
  getOccasions,
  getReminderDate
}

export default connect(mapState, mapDispatch)(withStyles(s)(Reminders))
