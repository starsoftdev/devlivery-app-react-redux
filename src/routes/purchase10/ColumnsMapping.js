import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ColumnsMapping.css'
import {Actions, ColumnsMappingForm, SectionHeader, UploadedContacts} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import {injectIntl} from 'react-intl'
import {importContacts, openUploadedContactsModal} from '../../reducers/contacts'
import {nextFlowStep} from '../../reducers/purchase'

class ColumnsMapping extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.columnsMappingForm.validateFields((err, values) => {
      if (!err) {
        this.props.importContacts(values)
        // TODO
        this.props.nextFlowStep()
      }
    })
  }

  render() {
    const {flowIndex, intl, uploadedContactsModalOpened, openUploadedContactsModal} = this.props

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
          <ColumnsMappingForm
            className={s.columnsMappingForm}
            ref={ref => this.columnsMappingForm = ref}
            onSubmit={this.handleSubmit}
          />
        </div>
        <Actions>
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
        </Actions>
        {uploadedContactsModalOpened && <UploadedContacts/>}
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
  mappingColumns: state.contacts.mappingColumns,
  uploadedContactsModalOpened: state.contacts.uploadedContactsModalOpened,
})

const mapDispatch = {
  openUploadedContactsModal,
  importContacts,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(injectIntl(withStyles(s)(ColumnsMapping)))
