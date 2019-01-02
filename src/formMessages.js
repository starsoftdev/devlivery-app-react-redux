import {defineMessages} from 'react-intl'

export default defineMessages({
  required: {
    id: 'form.required',
    defaultMessage: 'The field is required.',
  },
  emailInvalid: {
    id: 'form.emailInvalid',
    defaultMessage: 'The email is invalid.',
  },
  invalid: {
    id: 'form.invalid',
    defaultMessage: 'The field is invalid.',
  },
  maxLength: {
    id: 'form.maxLength',
    defaultMessage: 'Max length is {length} characters.',
  },
  minLength: {
    id: 'form.minLength',
    defaultMessage: 'The field must be at least {length} characters long.',
  },
  passwordNotMatch: {
    id: 'form.passwordNotMatch',
    defaultMessage: 'Password does not match the confirm password.',
  },
  donation_amount: {
    id: 'form.donation_amount',
    defaultMessage: 'Sorry, you must select a donation amount.',
  },
  positive:{
    id: 'form.positive',
    defaultMessage: 'This field must be positive.',
  },
  amount_bigger:{
    id: 'form.amount_bigger',
    defaultMessage: 'Sorry, but donation needs to be bigger than 0',
  },
  pastdate:{
    id: 'form.pastdate',
    defaultMessage: 'please enter a date in the past.',
  },
  invalidDate:{
    id: 'form.invalidDate',
    defaultMessage: 'Invalid Date Format.',
  },
  success_subscribed:{
    id: 'form.success_subscribed',
    defaultMessage: 'successfully subscribed',
  },
  failed_subscribed:{
    id: 'form.failed_subscribed',
    defaultMessage: 'failed your subscribe',
  },
  success_coupon:{
    id: 'form.success_coupon',
    defaultMessage: 'Successfully applied coupon',
  },
  error_transactionid:{
    id: 'form.error_transactionid',
    defaultMessage: 'transaction id doesn\'t exist',
  },
  removed_bundle:{
    id: 'form.removed_bundle',
    defaultMessage: 'Bundle is successfully removed.',
  },
  msg_atleast: {
    id: 'importContacts.msg_atleast',
    defaultMessage: 'You have to select at least one contact.',
  },
  updated_contact: {
    id: 'form.updated_contact',
    defaultMessage: 'Contact was successfully updated',
  },
  changed_pwd: {
    id: 'form.changed_pwd',
    defaultMessage: 'Password changed.',
  },
})
