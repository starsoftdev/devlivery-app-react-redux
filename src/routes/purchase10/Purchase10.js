import React from 'react'
import {connect} from 'react-redux'
import {ADD_CONTACT_MANUALLY, IMPORT_CONTACTS} from '../../reducers/purchase'
import {Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase10.css'
import {Card, PurchaseActions, SectionHeader} from '../../components'
import AddContactManuallyIcon from '../../static/add_contacts_manually.svg'
import ImportContactsIcon from '../../static/import_contacts.svg'
import ImportContacts from './ImportContacts'
import AddContact from './AddContact'
import messages from './messages'

class Purchase10 extends React.Component {
  state = {
    addingContactMode: null,
  }

  setAddingContactsMode = (addingContactMode) => {
    this.setState({addingContactMode})
  }

  render() {
    const {addingContactMode} = this.state
    const {flowIndex, intl} = this.props
    return (
      <React.Fragment>
        {addingContactMode === ADD_CONTACT_MANUALLY ? (
          <AddContact intl={intl}/>
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

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase10))
