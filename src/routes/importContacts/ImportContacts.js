import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Row, message } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ImportContacts.css'
import { ColumnsMappingForm, ContactsImporting, UploadedContacts } from '../../components'
import messages from './messages'
import { importContacts, openUploadedContactsModal } from '../../reducers/contacts'
import PlusIcon from '../../static/plus.svg'
import history from '../../history'
import { generateUrl } from '../../router'
import { CONTACTS_ROUTE } from '../'

class ImportContacts extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.props.selectedContacts.length <= 0) {
      message.warn("You have to select at least one contact.");
      return;
    }
    this.columnsMappingForm.validateFields((err, values) => {
      if (!err) {
        this.props.importContacts(values, () => history.push(generateUrl(CONTACTS_ROUTE)))
      }
    })
  }

  render() {
    const { mappingColumns, intl, uploadedContactsModalOpened, openUploadedContactsModal } = this.props

    return (
      <div className={s.container}>
        {mappingColumns ? (
          <React.Fragment>
            <div className={s.content}>
              <div className={s.headerWrapper}>
                <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
                <Button
                  onClick={openUploadedContactsModal}
                  type='primary'
                  ghost
                >
                  {intl.formatMessage(messages.selectContacts)}
                </Button>
              </div>
              <p className={s.subHeader}>{intl.formatMessage(messages.subHeader)}</p>
              <ColumnsMappingForm
                className={s.columnsMappingForm}
                ref={ref => this.columnsMappingForm = ref}
                onSubmit={this.handleSubmit}
              />
            </div>
            <div className={s.actionsWrapper}>
              <div className={s.actions}>
                <Button
                  onClick={this.handleSubmit}
                  type='primary'
                  ghost
                >
                  <PlusIcon />
                  {intl.formatMessage(messages.submit)}
                </Button>
              </div>
            </div>
            {uploadedContactsModalOpened && <UploadedContacts />}
          </React.Fragment>
        ) : (
            <ContactsImporting sectionClassName={s.instructions}>
              {({
                exportFromXLSX,
                //exportGoogleContacts,
                //exportOutlookContacts,
                //exportCardContacts,
                //csvUploadButton,
                //xlsUploadButton,
                xlsxUploadButton,
                //vcfUploadButton,
              }) =>
                <div className={s.content}>
                  <Row type='flex' gutter={20}>
                    <Col xs={24} md={12}>
                      <section>
                        <h1 className={s.sectionHeader}>{intl.formatMessage(messages.howto)}</h1>
                        {exportFromXLSX}
                        {/*exportGoogleContacts*/}
                        {/*exportOutlookContacts*/}
                        {/*exportCardContacts*/}
                      </section>
                    </Col>
                    <Col xs={24} md={6}>
                      <section>
                        <h1 className={s.sectionHeader}>{intl.formatMessage(messages.upload)}</h1>
                        {/*csvUploadButton*/}
                        {/*xlsUploadButton*/}
                        {xlsxUploadButton}
                        {/*vcfUploadButton*/}
                      </section>
                    </Col>
                  </Row>
                </div>
              }
            </ContactsImporting>
          )}
      </div>
    )
  }
}

const mapState = state => ({
  mappingColumns: state.contacts.mappingColumns,
  uploadedContactsModalOpened: state.contacts.uploadedContactsModalOpened,
  selectedContacts: state.contacts.selectedContacts
})

const mapDispatch = {
  openUploadedContactsModal,
  importContacts,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ImportContacts))
