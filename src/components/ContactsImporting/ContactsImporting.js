import React from 'react'
import {connect} from 'react-redux'
import {Button, Upload} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactsImporting.css'
import PlusIcon from '../../static/plus.svg'
import {uploadContacts} from '../../reducers/contacts'
import {injectIntl} from 'react-intl'
import cn from 'classnames'

// TODO add translations
class ContactsImporting extends React.Component {
  render() {
    const {uploadContacts, children, intl, sectionClassName} = this.props

    const exportGoogleContacts = (
      <ol className={cn(s.instructions, sectionClassName)}>
        <li>Open <a href='https://gmail.com' rel='nofollow' target='_blank' className={s.link}>Gmail</a>.</li>
        <li>Under Gmail Menu, select <b>Contacts</b>.</li>
        <li>Click the <b>More</b> button in the <b>Contacts</b> toolbar.</li>
        <li>Select <b>Export</b> from the menu.</li>
        <li>Select <b>All Contacts</b> or <b>Contacts Group</b>.</li>
        <li>Select <b>Google CSV</b> format.</li>
        <li>Click on <b>Export</b>.</li>
      </ol>
    )

    const exportOutlookContacts = (
      <ol className={cn(s.instructions, sectionClassName)}>
        <li>Open <a href='https://outlook.com' rel='nofollow' target='_blank' className={s.link}>Outlook</a>.</li>
        <li>Once logged in, click the <b>Apps</b> icon in the upper left-hand corner.</li>
        <li>Click <b>People</b>.</li>
        <li>Click <b>Manage > Export Contacts</b>.</li>
        <li>Select all contacts or a contact folder.</li>
        <li>Click <b>Export</b>.</li>
      </ol>
    )

    const exportCardContacts = (
      <ol className={cn(s.instructions, sectionClassName)}>
        <li>Open the <b>Applications</b> menu.</li>
        <li>Choose <b>Contacts</b>.</li>
        <li>Pick the list you want to export, such as <b>All Contacts</b>.</li>
        <li>From the Contacts menu, use the <b>File > Export Expert vCard</b> menu item.</li>
      </ol>
    )

    const csvUploadButton = (
      <Upload
        className={s.importBtnWrapper}
        accept='.csv'
        beforeUpload={(file) => {
          uploadContacts(file, 'csv')
          return false
        }}
        fileList={[]}
      >
        <Button type='primary' ghost className={s.importBtn}>
          <PlusIcon/>
          .CSV
        </Button>
      </Upload>
    )

    const xlsUploadButton = (
      <Upload
        className={s.importBtnWrapper}
        accept='application/vnd.ms-excel'
        beforeUpload={(file) => {
          uploadContacts(file, 'xls')
          return false
        }}
        fileList={[]}
      >
        <Button type='primary' ghost className={s.importBtn}>
          <PlusIcon/>
          .XLS
        </Button>
      </Upload>
    )

    const vcfUploadButton = (
      <Upload
        className={s.importBtnWrapper}
        accept='text/x-vcard'
        beforeUpload={(file) => {
          uploadContacts(file, 'vcf')
          return false
        }}
        fileList={[]}
      >
        <Button type='primary' ghost className={s.importBtn}>
          <PlusIcon/>
          .VCF
        </Button>
      </Upload>
    )

    const googleConnectButton = (
      <Button type='primary' ghost className={s.connectBtn}>
        <PlusIcon/>
        Google
      </Button>
    )

    return children({
      exportGoogleContacts,
      exportOutlookContacts,
      exportCardContacts,
      csvUploadButton,
      xlsUploadButton,
      vcfUploadButton,
      googleConnectButton,
    })
  }
}

const mapState = state => ({})

const mapDispatch = {
  uploadContacts,
}

export default injectIntl(connect(mapState, mapDispatch)(withStyles(s)(ContactsImporting)))
