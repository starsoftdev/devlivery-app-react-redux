export const getSuccessMessage = (res) => res && typeof res.data === 'string' ? res.data : null

export const getErrorMessage = (res) => res && typeof res.data === 'string' ? res.data : 'Something went wrong. Please try again.'
