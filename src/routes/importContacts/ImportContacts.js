import React from 'react'
import {connect} from 'react-redux'
import {Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ImportContacts.css'
import {ContactsImporting} from '../../components'

class ImportContacts extends React.Component {
  render() {
    return (
      <ContactsImporting>
        {({
            exportGoogleContacts,
            exportOutlookContacts,
            exportCardContacts,
            csvUploadButton,
            xlsUploadButton,
            vcfUploadButton,
            googleConnectButton,
          }) =>
          <div className={s.container}>
            <Row type='flex' gutter={20}>
              <Col xs={24} md={12}>
                <section>
                  <h1 className={s.sectionHeader}>How To Export Contacts</h1>
                  {exportGoogleContacts}
                  {exportOutlookContacts}
                  {exportCardContacts}
                </section>
              </Col>
              <Col xs={24} md={6}>
                <section>
                  <h1 className={s.sectionHeader}>Upload</h1>
                  {csvUploadButton}
                  {xlsUploadButton}
                  {vcfUploadButton}
                </section>
              </Col>
              <Col xs={24} md={6}>
                <section>
                  <h1 className={s.sectionHeader}>Connect</h1>
                  {googleConnectButton}
                </section>
              </Col>
            </Row>
          </div>
        }
      </ContactsImporting>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(ImportContacts))
