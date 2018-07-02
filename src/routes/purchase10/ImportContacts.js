import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ImportContacts.css'
import {Actions, ContactsImporting, SectionHeader} from '../../components'
import cn from 'classnames'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {nextFlowStep} from '../../reducers/purchase'
import messages from './messages'
import ColumnsMapping from './ColumnsMapping'

class ImportContacts extends React.Component {
  render() {
    const {mappingColumns, flowIndex, nextFlowStep, intl} = this.props

    return mappingColumns ? (
      <ColumnsMapping/>
    ) : (
      <ContactsImporting>
        {({
            exportGoogleContacts,
            exportOutlookContacts,
            exportCardContacts,
            csvUploadButton,
            xlsUploadButton,
            vcfUploadButton,
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
                  {csvUploadButton}
                  {xlsUploadButton}
                  {vcfUploadButton}
                </Col>
                <Col xs={24} sm={12} className={s.section}>
                  {exportOutlookContacts}
                </Col>
                <Col xs={24} sm={12} className={s.section}>
                  {exportCardContacts}
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
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(ImportContacts))
