import React from 'react'
import {connect} from 'react-redux'
import {
  ADD_CONTACTS_MANUALLY,
  IMPORT_CONTACTS,
  setAddingContactsMode,
  submitAddingContacts
} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase10.css'
import {Actions, Card, SectionHeader} from '../../components'
import AddContactManuallyIcon from '../../static/add_contacts_manually.svg'
import ImportContactsIcon from '../../static/import_contacts.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import ImportContacts from './ImportContacts'

class Purchase10 extends React.Component {
  render() {
    const {addingContactsMode, setAddingContactsMode, submitAddingContacts} = this.props
    return (
      <React.Fragment>
        {addingContactsMode === ADD_CONTACTS_MANUALLY ? (
          <div className={s.addContactsContent}>
            <SectionHeader
              header={'Add your Contact(s)'}
              number={10}
              prefixClassName={s.addContactsHeaderPrefix}
            />
            <div/>
          </div>
        ) : addingContactsMode === IMPORT_CONTACTS ? (
          <div className={s.importContactsContent}>
            <SectionHeader
              header={'Add your Contact(s)'}
              number={10}
              prefixClassName={s.importContactsHeaderPrefix}
            />
            <ImportContacts/>
          </div>
        ) : (
          <div className={s.content}>
            <SectionHeader
              header={'Add your Contact(s)'}
              number={10}
              prefixClassName={s.headerPrefix}
            />
            <Row className={s.items} gutter={20} type='flex' align='center'>
              <Col className={s.itemWrapper}>
                <Card
                  className={s.item}
                  title={'Add contact manually'}
                  onClick={() => setAddingContactsMode(ADD_CONTACTS_MANUALLY)}
                  active={addingContactsMode === ADD_CONTACTS_MANUALLY}
                  keyValue='a'
                  svg={AddContactManuallyIcon}
                />
              </Col>
              <Col className={s.itemWrapper}>
                <Card
                  className={s.item}
                  title={'Import contacts'}
                  onClick={() => setAddingContactsMode(IMPORT_CONTACTS)}
                  active={addingContactsMode === IMPORT_CONTACTS}
                  keyValue='b'
                  svg={ImportContactsIcon}
                />
              </Col>
            </Row>
          </div>
        )}
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={submitAddingContacts}
          />
          <Button
            onClick={submitAddingContacts}
            type='primary'
            disabled={!addingContactsMode}
          >
            Submit
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  addingContactsMode: state.purchase.addingContactsMode,
})

const mapDispatch = {
  setAddingContactsMode,
  submitAddingContacts,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase10))
