import React from 'react'
import { connect } from 'react-redux'
import { Button,message } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ColumnsMapping.css'
import { PurchaseActions, ColumnsMappingForm, SectionHeader, UploadedContacts } from '../../components'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import messages from './messages'
import { injectIntl } from 'react-intl'
import { importContacts, openUploadedContactsModal } from '../../reducers/contacts'
import { nextFlowStep, GROUP_ID_KEY, CONTACT_IDS_KEY, gotoConfirm,setNewRecipients } from '../../reducers/purchase'
import {contact_map,address_map} from '../../constants';

class ColumnsMapping extends React.Component {
  state = {
    isRequireAddress: false
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  handleSubmit = () => {
    //e.preventDefault()
    if(this.props.selectedContacts.length <= 0)
    {
      message.warn("You have to select at least one contact.");
      return false;
    }
    this.columnsMappingForm.validateFields((err, values) => {
      if (!err) {
        this.setState({isRequireAddress: false});
        if(this.validateAddress(values))
        {
          this.props.importContacts(values, this.columnsMappingForm,this.props.intl, (newrecipient) => {
            localStorage.removeItem(GROUP_ID_KEY)
            if (newrecipient) {
              if (this.props.recipientMode)
              {
                this.props.setNewRecipients(newrecipient);
                this.props.gotoConfirm();
              }
              else {
                localStorage.removeItem(CONTACT_IDS_KEY)
                this.props.setNewRecipients(newrecipient);
                this.props.nextFlowStep()
              }
            }
            else this.props.refreshPage();
          })
        } else this.setState({isRequireAddress: true});
        return true;
      }
      return false;
    })
    return false;
  }
  validateAddress(values){
    let result = false;
    address_map.map(item => {
      if(values['home_'+item] !== undefined)
        result = true;
    });
    address_map.map(item => {
      if(values['office_'+item] !== undefined)
        result = true;
    });
    return result;
  }
  render() {
    const { flowIndex, intl, uploadedContactsModalOpened, openUploadedContactsModal } = this.props

    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            className={s.header}
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          >
            <Button
              onClick={openUploadedContactsModal}
              type='primary'
              ghost
            >
              {intl.formatMessage(messages.selectContacts)}
            </Button>
          </SectionHeader>
          <p>{intl.formatMessage(messages.importDescription)}</p>

          <ColumnsMappingForm
            className={s.columnsMappingForm}
            ref={ref => this.columnsMappingForm = ref}
            onSubmit={this.handleSubmit}
            isRequireAddress={this.state.isRequireAddress}
          />
        </div>
        <PurchaseActions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button
            onClick={this.handleSubmit}
            type='primary'
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
        {uploadedContactsModalOpened && <UploadedContacts />}
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  recipientMode: state.purchase.recipientMode,
  flowIndex: state.purchase.flowIndex,
  mappingColumns: state.contacts.mappingColumns,
  uploadedContactsModalOpened: state.contacts.uploadedContactsModalOpened,
  selectedContacts: state.contacts.selectedContacts
})

const mapDispatch = {
  openUploadedContactsModal,
  importContacts,
  nextFlowStep,
  gotoConfirm,
  setNewRecipients
}

export default injectIntl(connect(mapState, mapDispatch)(withStyles(s)(ColumnsMapping)))
