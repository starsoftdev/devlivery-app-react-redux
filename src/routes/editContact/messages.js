import {defineMessages} from 'react-intl'

export default defineMessages({
  title: {
    id: 'editContact.title',
    defaultMessage: 'Edit Contact',
  },
  breadcrumb: {
    id: 'editContact.breadcrumb',
    defaultMessage: 'Edit Contact',
  },
  header: {
    id: 'editContact.header',
    defaultMessage: 'Contact Details',
  },
  submit: {
    id: 'editContact.submit',
    defaultMessage: 'Save Contact',
  },
  delete: {
    id: 'editContact.delete',
    defaultMessage: 'Delete Contact',
  },
  confirmRemoving: {
    id: 'contacts.confirmRemoving',
    defaultMessage: 'Are you sure you want to delete?',
  },
  acceptRemoving: {
    id: 'contactGroups.acceptRemoving',
    defaultMessage: 'Yes',
  },
  requireadres: {
    id: 'addContact.requireadres',
    defaultMessage: 'Home address or Company address is required.',
  },
  warningRemoving: {
    id: 'contactGroups.warningRemoving',
    defaultMessage: 'This contact can\'t be deleted because is a recipient in one of your orders.',
  }
})
