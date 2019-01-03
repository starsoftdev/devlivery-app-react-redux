import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Row, message } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ImportContacts.css'
import { ColumnsMappingForm, ContactsImporting, UploadedContacts } from '../../components'
import messages from './messages'
import { importContacts, openUploadedContactsModal,clearMapColums } from '../../reducers/contacts'
import PlusIcon from '../../static/plus.svg'
import history from '../../history'
import { generateUrl } from '../../router'
import { CONTACTS_ROUTE } from '../'
import {contact_map,address_map} from '../../constants';
import formMessages from '../../formMessages'
import RemoveIcon from '../../static/remove.svg'

class ImportContacts extends React.Component {
  state = {
    isRequireAddress: false
  }
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.props.selectedContacts.length <= 0) {
      message.warn(this.props.intl.formatMessage(messages.msg_atleast));
      return;
    }
    this.columnsMappingForm.validateFields((err, values) => {
      if (!err) {
        this.setState({isRequireAddress: false});
        if(this.validateAddress(values))
        {
          this.props.importContacts(values,this.columnsMappingForm,this.props.intl, (callback) => callback && history.push(generateUrl(CONTACTS_ROUTE)))
        }
        else this.setState({isRequireAddress: true});
      }
    })
  }
  validateAddress(values){
    let result = false;
    address_map.map(item => {
      if(values['home_'+item] !== undefined)
        result = true;
    });
    let office = false;
    address_map.map(item => {
      if(values['office_'+item] !== undefined)
      {
        result = true;
        office = true;
      }
    });
    if(office && values['company'] === undefined)
    {
      this.columnsMappingForm.setFields({
        company: {
          value:values['company'],
          errors: [new Error(this.props.intl.formatMessage(formMessages.required))],
        }
      });
      return false;
    }
    return result;
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
                isRequireAddress={this.state.isRequireAddress}
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
                <div className={s.actionsRight}>
                <Button
                  onClick={()=>this.props.clearMapColums()}
                  type='primary'
                  ghost
                >
                  <RemoveIcon/>
                  {intl.formatMessage(messages.cancelEdit)}
                </Button>
                </div>
              </div>
            </div>
            {uploadedContactsModalOpened && <UploadedContacts />}
          </React.Fragment>
        ) : (
            <ContactsImporting sectionClassName={s.instructions}>
              {({
                exportFromXLSX,
                exportGoogleContacts,
                exportOutlookContacts,
                exportCardContacts,
                csvUploadButton,
                xlsUploadButton,
                xlsxUploadButton,
                vcfUploadButton,
              }) =>
                <div className={s.content}>
                  <Row type='flex' gutter={20}>
                    <Col xs={24} md={24}>
                      <h1 className={s.sectionHeader}>{intl.formatMessage(messages.howto)}</h1>
                    </Col>
                  </Row>
                  <Row type='flex' gutter={20}>
                    <Col xs={24} md={12}>
                      <section>
                        {exportGoogleContacts}
                        {exportOutlookContacts}
                        {exportCardContacts}
                      </section>
                    </Col>
                    <Col xs={24} md={12}>
                      <section>
                        {exportFromXLSX}
                      </section>
                    </Col>
                  </Row>
                  <h1 className={s.sectionHeader}>{intl.formatMessage(messages.upload)}</h1>
                  <Row type='flex' gutter={20}>
                    <Col xs={24} md={6}>
                      {csvUploadButton}
                    </Col>
                    <Col xs={24} md={6}>
                      {xlsUploadButton}
                    </Col>
                    <Col xs={24} md={6}>
                      {xlsxUploadButton}
                    </Col>
                    <Col xs={24} md={6}>
                      {vcfUploadButton}
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
  clearMapColums
}

export default connect(mapState, mapDispatch)(withStyles(s)(ImportContacts))
