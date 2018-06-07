import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ImportContacts.css'
import PlusIcon from '../../static/plus.svg'

class ImportContacts extends React.Component {
  render() {
    return (
      <Row gutter={20} type='flex' align='center' className={s.container}>
        <Col xs={24} sm={12} className={s.section}>
          <ol className={s.instructions}>
            <li>Open <a href='https://gmail.com' rel='nofollow' target='_blank' className={s.link}>Gmail</a>.</li>
            <li>Under Gmail Menu, select <b>Contacts</b>.</li>
            <li>Click the <b>More</b> button in the <b>Contacts</b> toolbar.</li>
            <li>Select <b>Export</b> from the menu.</li>
            <li>Select <b>All Contacts</b> or <b>Contacts Group</b>.</li>
            <li>Select <b>Google CSV</b> format.</li>
            <li>Click on <b>Export</b>.</li>
          </ol>
        </Col>
        <Col xs={24} sm={12} className={s.section}>
          <Button type='primary' ghost className={s.importBtn}>
            <PlusIcon/>
            .CSV
          </Button>
          <Button type='primary' ghost className={s.importBtn}>
            <PlusIcon/>
            .XLS
          </Button>
          <Button type='primary' ghost className={s.importBtn}>
            <PlusIcon/>
            .VCF
          </Button>
        </Col>
        <Col xs={24} sm={12} className={s.section}>
          <ol className={s.instructions}>
            <li>Open <a href='https://outlook.com' rel='nofollow' target='_blank' className={s.link}>Outlook</a>.</li>
            <li>Once logged in, click the <b>Apps</b> icon in the upper left-hand corner.</li>
            <li>Click <b>People</b>.</li>
            <li>Click <b>Manage > Export Contacts</b>.</li>
            <li>Select all contacts or a contact folder.</li>
            <li>Click <b>Export</b>.</li>
          </ol>
        </Col>
        <Col xs={24} sm={12} className={s.section}>
          <ol className={s.instructions}>
            <li>Open the <b>Applications</b> menu.</li>
            <li>Choose <b>Contacts</b>.</li>
            <li>Pick the list you want to export, such as <b>All Contacts</b>.</li>
            <li>From the Contacts menu, use the <b>File > Export Expert vCard</b> menu item.</li>
          </ol>
        </Col>
      </Row>
    )
  }
}

const mapState = state => ({
})

const mapDispatch = {
}

export default connect(mapState, mapDispatch)(withStyles(s)(ImportContacts))
