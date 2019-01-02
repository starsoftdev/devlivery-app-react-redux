import React from 'react'
import {connect} from 'react-redux'
import {Button, Upload} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactsImporting.css'
import PlusIcon from '../../static/plus.svg'
import {uploadContacts} from '../../reducers/contacts'
import {injectIntl} from 'react-intl'
import cn from 'classnames'
import {exampleXLSX_url_de,exampleXLSX_url_en} from '../../constants';

// TODO add translations
class ContactsImporting extends React.Component {
  render() {
    const {uploadContacts, children, intl, sectionClassName} = this.props

    const exportFromXLSX = intl.locale === 'de-DE' ?
    (
      <div className={s.xlsxCommentConatiner}>
        <ol className={cn(s.instructions, sectionClassName)}>
          <li> Click on <b>.xlsx</b> button to import your file</li>
          <li> <b>Select</b> the file you want to upload</li>
          <li> <b>Match</b> the column headers</li>
          <li> Press <b>Save</b> and your contacts will be imported</li>
        </ol>
        <h3>Rules for Your File</h3>
        <p>Your file must observe the following rules or your upload might fail:</p>
        <ol className={cn(s.instructions)}>
          <li>Your first line must be <b>headings</b> for each of the columns, this is going to be used for matching with the correct fields in <b>byZumi</b>.</li>
          <li>Your file must be exported as <b>XLSX</b>.</li>
          <li>Your file must have <b>one contact</b> per row and each column represents a different field.</li>
          <li><b>First and Last Name</b> need to be separated.</li>
          <li><b>Address</b> needs to be broken into parts (address, secondary address, city, zip code, country).</li>
          <li><b>Address, First Name, Last Name</b> is mandatory for all contacts or import will fail.</li>
        </ol>
        <p>Please find attached below an <b>example XLSX</b> to facilitate your import.</p>
        <a href={exampleXLSX_url_de} download>
          <Button type='primary' size={'small'} ghost className={s.importBtn}>
            Example XLSX
          </Button>
        </a>
      </div>
    )
    : (
      <div className={s.xlsxCommentConatiner}>
        <ol className={cn(s.instructions, sectionClassName)}>
          <li> Click on <b>.xlsx</b> button to import your file</li>
          <li> <b>Select</b> the file you want to upload</li>
          <li> <b>Match</b> the column headers</li>
          <li> Press <b>Save</b> and your contacts will be imported</li>
        </ol>
        <h3>Rules for Your File</h3>
        <p>Your file must observe the following rules or your upload might fail:</p>
        <ol className={cn(s.instructions)}>
          <li>Your first line must be <b>headings</b> for each of the columns, this is going to be used for matching with the correct fields in <b>byZumi</b>.</li>
          <li>Your file must be exported as <b>XLSX</b>.</li>
          <li>Your file must have <b>one contact</b> per row and each column represents a different field.</li>
          <li><b>First and Last Name</b> need to be separated.</li>
          <li><b>Address</b> needs to be broken into parts (address, secondary address, city, zip code, country).</li>
          <li><b>Address, First Name, Last Name</b> is mandatory for all contacts or import will fail.</li>
        </ol>
        <p>Please find attached below an <b>example XLSX</b> to facilitate your import.</p>
        <a href={exampleXLSX_url_en} download>
          <Button type='primary' size={'small'} ghost className={s.importBtn}>
            Example XLSX
          </Button>
        </a>
      </div>
    )

    const exportGoogleContacts = intl.locale === 'de-DE' ?
    (
      <ol className={cn(s.instructions, sectionClassName)}>
        <li><a href='https://gmail.com' rel='nofollow' target='_blank' className={s.link}>Gmail</a> öffnen.</li>
        <li>Gehen Sie ins Gmail Menu und wählen Sie die Rubrik <b>Kontakte</b> an.</li>
        <li>Klicken Sie auf den <b>"mehr"</b> Button in <b>der</b> Toolbar.</li>
        <li>Wählen Sie die Funktion <b>"Exportieren"</b> aus dem Menu.</li>
        <li>Wählen Sie alle <b>Kontakte</b> und <b>Gruppen</b> welche Sie exportieren wollen.</li>
        <li>Wählen Sie <b>Google CSV</b> Format.</li>
        <li>Klickne Sie auf <b>"Export"</b>.</li>
      </ol>
    )
    : (
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

    const exportOutlookContacts = intl.locale === 'de-DE' ? 
    (
      <ol className={cn(s.instructions, sectionClassName)}>
        <li>Öffnen Sie <a href='https://outlook.com' rel='nofollow' target='_blank' className={s.link}>Outlook</a>.</li>
        <li>Nachdem Sie eingeloggt sind klicken Sie auf auf das <b>App Icon Links</b> oben.</li>
        <li><b>Kontakte</b> anwählen.</li>
        <li><b>Rubrik</b> bearbeiten anwählen .</li>
        <li>Wählen Sie alle Kontakte oder Kontaktordner.</li>
        <li><b>Kontakte</b> exportieren.</li>
      </ol>
    )
    :(
      <ol className={cn(s.instructions, sectionClassName)}>
        <li>Open <a href='https://outlook.com' rel='nofollow' target='_blank' className={s.link}>Outlook</a>.</li>
        <li>Once logged in, click the <b>Apps</b> icon in the upper left-hand corner.</li>
        <li>Click <b>People</b>.</li>
        <li>Click <b>Manage > Export Contacts</b>.</li>
        <li>Select all contacts or a contact folder.</li>
        <li>Click <b>Export</b>.</li>
      </ol>
    )

    const exportCardContacts = intl.locale === 'de-DE' ? 
    (
      <ol className={cn(s.instructions, sectionClassName)}>
        <li><b>Auswahlmenu</b> öffnen.</li>
        <li><b>Kontakte</b> wählen.</li>
        <li>Die Liste anwählen welche <b>Sie</b> exportieren möchten.</li>
        <li>Verwenden Sie im Menü Kontakte den <b>Menübefehl Datei Expert</b> exportieren vCard.</li>
      </ol>
    ) 
    :(
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
    const xlsxUploadButton = (
      <Upload
        className={s.importBtnWrapper}
        accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        beforeUpload={(file) => {
          uploadContacts(file, 'xlsx')
          return false
        }}
        fileList={[]}
      >
        <Button type='primary' ghost className={s.importBtn}>
          <PlusIcon/>
          .XLSX
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
      exportFromXLSX,
      exportGoogleContacts,
      exportOutlookContacts,
      exportCardContacts,
      csvUploadButton,
      xlsUploadButton,
      xlsxUploadButton,
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
