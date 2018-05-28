export const getFormErrors = ({values, errors}) => {
  if (errors.non_field_errors) {
    // error on alert
    return {error: errors.non_field_errors && errors.non_field_errors[0]}
  } else {
    // errors on form fields
    const formErrors = {}
    const fields = Object.keys(errors)
    fields.forEach(field => {
      formErrors[field] = {
        value: values[field],
        errors: [{
          field,
          message: errors[field][0]
        }]
      }
    })
    return {formErrors}
  }
}
