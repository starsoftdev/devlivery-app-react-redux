import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ImportContacts.css'
import { PurchaseActions, ContactsImporting, SectionHeader } from '../../components'
import cn from 'classnames'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import messages from './messages'
import ColumnsMapping from './ColumnsMapping'

class ImportContacts extends React.Component {
  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  handleSubmit() {
    if (this.ref_mapping)
      return this.ref_mapping.handleSubmit();
    return false;
  }
  render() {
    const { mappingColumns, flowIndex, intl } = this.props

    return mappingColumns ? (
        <ColumnsMapping onRef={ref => (this.ref_mapping = ref)} refreshPage={this.props.refreshPage} />
    ) : (
        <ContactsImporting >
          {({
            exportGoogleContacts,
            exportOutlookContacts,
            exportCardContacts,
            //csvUploadButton,
            //xlsUploadButton,
            xlsxUploadButton,
            //vcfUploadButton,
          }) =>
            <React.Fragment>
              <div className={s.content}>
                <SectionHeader
                  header={intl.formatMessage(messages.header)}
                  number={flowIndex + 1}
                  prefixClassName={s.headerPrefix}
                />
                <Row gutter={20} type='flex' align='center'>
                  <Col xs={24} sm={12} className={s.section}>
                    {exportGoogleContacts}
                  </Col>
                  <Col xs={24} sm={12} className={cn(s.section, s.actionsSection)}>
                    {/*csvUploadButton*/}
                    {/*xlsUploadButton*/}
                    {xlsxUploadButton}
                    {/*vcfUploadButton*/}
                  </Col>
                  <Col xs={24} sm={12} className={s.section}>
                    {exportOutlookContacts}
                  </Col>
                  <Col xs={24} sm={12} className={s.section}>
                    {exportCardContacts}
                  </Col>
                </Row>
              </div>
            </React.Fragment>
          }
        </ContactsImporting>
      )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
  mappingColumns: state.contacts.mappingColumns,
})

const mapDispatch = {

}

export default connect(mapState, mapDispatch)(withStyles(s)(ImportContacts))
