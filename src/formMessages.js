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
})
