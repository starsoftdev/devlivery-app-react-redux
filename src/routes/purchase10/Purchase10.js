import React from 'react'
import {connect} from 'react-redux'
import {ADD_CONTACT_MANUALLY, IMPORT_CONTACTS, nextFlowStep, setAddingContactsMode} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase10.css'
import {Actions, Card, SectionHeader} from '../../components'
import AddContactManuallyIcon from '../../static/add_contacts_manually.svg'
import ImportContactsIcon from '../../static/import_contacts.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import ImportContacts from './ImportContacts'
import AddContact from './AddContact'
import messages from './messages'

class Purchase10 extends React.Component {
  render() {
    const {addingContactMode, setAddingContactsMode, nextFlowStep, flowIndex, intl} = this.props
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
                    onClick={() => setAddingContactsMode(ADD_CONTACT_MANUALLY)}
                    active={addingContactMode === ADD_CONTACT_MANUALLY}
                    keyValue='a'
                    svg={AddContactManuallyIcon}
                  />
                </Col>
                <Col className={s.itemWrapper}>
                  <Card
                    className={s.item}
                    title={intl.formatMessage(messages.importContacts)}
                    onClick={() => setAddingContactsMode(IMPORT_CONTACTS)}
                    active={addingContactMode === IMPORT_CONTACTS}
                    keyValue='b'
                    svg={ImportContactsIcon}
                  />
                </Col>
              </Row>
            </div>
            <Actions>
              <KeyHandler
                keyEventName={KEYPRESS}
                keyCode={13}
                onKeyHandle={nextFlowStep}
              />
              <Button
                onClick={nextFlowStep}
                type='primary'
              >
                {intl.formatMessage(messages.submit)}
              </Button>
            </Actions>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  addingContactMode: state.purchase.addingContactMode,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  setAddingContactsMode,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase10))
