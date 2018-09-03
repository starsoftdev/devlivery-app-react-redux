import React from 'react'
import {connect} from 'react-redux'
import {ADD_CONTACT_MANUALLY, IMPORT_CONTACTS,nextFlowStep} from '../../reducers/purchase'
import {Button,Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase10.css'
import {Card, PurchaseActions, SectionHeader} from '../../components'
import AddContactManuallyIcon from '../../static/add_contacts_manually.svg'
import ImportContactsIcon from '../../static/import_contacts.svg'
import ImportContacts from './ImportContacts'
import AddContact from './AddContact'
import messages from './messages'
import Contacts from '../../routes/contacts/Contacts';
import ContactGroups from '../../routes/contactGroups/ContactGroups';
import {getContactsByName} from '../../reducers/contacts'
import {getContactGroups} from '../../reducers/contactGroups'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {message} from 'antd'


class Purchase10 extends React.Component {
  state = {
    addingContactMode: null,
    selectedContact: null,
    selectedGroupName:'',
    selectMode: 'group',
    isFirstSubmit:false,
    disableButton:false
  }
  constructor(props){
    super(props);
    this.selectExistingContact = this.selectExistingContact.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
    this.backToGroup = this.backToGroup.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.ref_addcontact = React.createRef();
  }
  setAddingContactsMode = (addingContactMode) => {
    this.setState({addingContactMode,selectedContact:null})
  }
  selectExistingContact(selectedContact){
    this.setState({isFirstSubmit:true,addingContactMode:ADD_CONTACT_MANUALLY,selectedContact});
  }
  selectGroup(group_name){
    this.props.getContactsByName(group_name);
    this.setState({selectMode:'contact',selectedGroupName:group_name})
  }
  backToGroup(){
    this.props.getContactGroups();
    this.setState({selectMode:'group',selectedGroupName:''})
  }
  refreshPage(){
    this.setState({
      addingContactMode: null,
      selectedContact: null,
      selectedGroupName:'',
      selectMode: 'group',
      isFirstSubmit:false,
      disableButton:false
    })
    this.props.getContactGroups();
  }
  onSubmit(){
    const {isFirstSubmit,addingContactMode} = this.state;
    if(!isFirstSubmit)
    {
      this.setState({isFirstSubmit: true});
      return;
    }

    if(addingContactMode === ADD_CONTACT_MANUALLY)
    {
      if(this.ref_addcontact)
      {
        this.setState({disableButton:true});
        if(!this.ref_addcontact.handleSubmit())
        {
          this.setState({disableButton:false});
        }
      }
    }
    if(addingContactMode === IMPORT_CONTACTS && this.ref_importcontact)
    {
      if(this.ref_importcontact.props.mappingColumns)
      {
        if(this.ref_importcontact)
        {
          this.setState({disableButton:true});
          if(!this.ref_importcontact.handleSubmit())
          {
            this.setState({disableButton:false});
          }
        }
      }
      else{
        message.error("Please upload contact file.");
      }
    }
  }
  renderGroupView(){
    return(<ContactGroups {...this.props} intl={this.props.intl} readonly = {true} selectGroup = {this.selectGroup}/>);
  }
  renderContactView(){
    return(
      <div className = {s.contactView}>
        <div className={s.actions}>
          <h3 className={s.header}>Selected Group Name: <strong>{this.state.selectedGroupName}</strong></h3>
          <Button type='primary' ghost onClick={this.backToGroup} size={'small'}>
            {'Group'}
          </Button>
        </div>
        <Contacts {...this.props} intl={this.props.intl} readonly = {true} selectExistingContact ={this.selectExistingContact}/>
      </div>
    )
  }
  render() {
    const {addingContactMode,selectMode,isFirstSubmit,disableButton} = this.state
    const {flowIndex, intl} = this.props
    return (
      <React.Fragment>
        {addingContactMode === ADD_CONTACT_MANUALLY && isFirstSubmit? (
          <AddContact intl={intl} selectedContact={this.state.selectedContact} onRef={ref => (this.ref_addcontact = ref)} />
        ) : addingContactMode === IMPORT_CONTACTS && isFirstSubmit? (
          <ImportContacts intl={intl} onRef={ref => (this.ref_importcontact = ref)} refreshPage={this.refreshPage}/>
        ) : (
          <React.Fragment>
            <div className={s.content}>
              <SectionHeader
                header={intl.formatMessage(messages.header)}
                number={flowIndex + 1}
                prefixClassName={s.headerPrefix}
              />
              <Row className={s.items} gutter={20} type='flex' align='center'>
                <Col className={s.itemWrapper}>
                  <Card
                    className={s.item}
                    title={intl.formatMessage(messages.addContactManually)}
                    onClick={() => this.setAddingContactsMode(ADD_CONTACT_MANUALLY)}
                    active={addingContactMode === ADD_CONTACT_MANUALLY}
                    keyValue='a'
                    svg={AddContactManuallyIcon}
                  />
                </Col>
                <Col className={s.itemWrapper}>
                  <Card
                    className={s.item}
                    title={intl.formatMessage(messages.importContacts)}
                    onClick={() => this.setAddingContactsMode(IMPORT_CONTACTS)}
                    active={addingContactMode === IMPORT_CONTACTS}
                    keyValue='b'
                    svg={ImportContactsIcon}
                  />
                </Col>
              </Row>
              { selectMode === 'group' && this.renderGroupView() }
              { selectMode === 'contact' && this.renderContactView() }
            </div>
          </React.Fragment>
        )}
        <PurchaseActions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => addingContactMode && this.onSubmit()}
          />
          <Button
            type='primary'
            disabled={!addingContactMode || disableButton}
            onClick={() => this.onSubmit()}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {getContactsByName,getContactGroups,nextFlowStep}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase10))
