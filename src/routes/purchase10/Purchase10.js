import React from 'react'
import {connect} from 'react-redux'
import {ADD_CONTACT_MANUALLY, IMPORT_CONTACTS} from '../../reducers/purchase'
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

class Purchase10 extends React.Component {
  state = {
    addingContactMode: null,
    selectedContact: null,
    selectedGroupName:'',
    selectMode: 'group'
  }
  constructor(props){
    super(props);
    this.selectExistingContact = this.selectExistingContact.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
    this.backToGroup = this.backToGroup.bind(this);
  }
  setAddingContactsMode = (addingContactMode) => {
    this.setState({addingContactMode})
  }
  selectExistingContact(selectedContact){
    this.setState({addingContactMode:ADD_CONTACT_MANUALLY,selectedContact});
  }
  selectGroup(group_name){
    this.props.getContactsByName(group_name);
    this.setState({selectMode:'contact',selectedGroupName:group_name})
  }
  backToGroup(){
    this.props.getContactGroups();
    this.setState({selectMode:'group',selectedGroupName:''})
  }
  renderGroupView(){
    return(
      <ContactGroups {...this.props} intl={this.props.intl} readonly = {true} selectGroup = {this.selectGroup}/>
    );
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
    const {addingContactMode,selectMode} = this.state
    const {flowIndex, intl} = this.props
    return (
      <React.Fragment>
        {addingContactMode === ADD_CONTACT_MANUALLY ? (
          <AddContact intl={intl} selectedContact={this.state.selectedContact}/>
        ) : addingContactMode === IMPORT_CONTACTS ? (
          <ImportContacts intl={intl}/>
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
            <PurchaseActions/>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {getContactsByName,getContactGroups}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase10))
