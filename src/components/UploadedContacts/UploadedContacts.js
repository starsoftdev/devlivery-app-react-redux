import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './UploadedContacts.css'
import {Modal, Table} from 'antd'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {changeSelectedContacts, closeUploadedContactsModal} from '../../reducers/contacts'
import messages from './messages'
import moment from 'moment'

class UploadedContacts extends React.Component {
  render() {
    const {uploadedContacts, closeUploadedContactsModal, intl, selectedContacts, changeSelectedContacts,loading} = this.props
    console.log('uploadedContacts',uploadedContacts);
    const columnsNames = uploadedContacts[0] ? Object.keys(uploadedContacts[0]) : []
    const columns = columnsNames.map(column => ({
      title: column === 'dob' ? 'date of birth' : column,
      dataIndex: column,
      key: column,
      render: (item) => column === 'dob' ? (item && item !== undefined ? moment(item,"YYYY-MM-DD").format("DD/MM/YYYY") :'') : JSON.stringify(item)
    }))

    return (
      <Modal
        visible
        title={intl.formatMessage(messages.header)}
        onOk={closeUploadedContactsModal}
        onCancel={closeUploadedContactsModal}
        width={1200}
      >
        <Table
          loading= {loading.uploadedContacts}
          className={s.table}
          columns={columns}
          dataSource={uploadedContacts}
          rowKey={(record, i) => i}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedContacts,
            onChange: changeSelectedContacts,
          }}
        />
      </Modal>
    )
  }
}

const mapState = state => ({
  loading: state.contacts.loading,
  uploadedContacts: state.contacts.uploadedContacts,
  selectedContacts: state.contacts.selectedContacts,
})

const mapDispatch = {
  closeUploadedContactsModal,
  changeSelectedContacts,
}

export default injectIntl(connect(mapState, mapDispatch)(withStyles(s)(UploadedContacts)))
