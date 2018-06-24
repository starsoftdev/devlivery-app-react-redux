/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error('Do not import `config.js` from inside the client-side code.')
}

module.exports = {
  // default locale is the first one
  locales: [
    /* @intl-code-template '${lang}-${COUNTRY}', */
    'en-US',
    'de-DE',
    /* @intl-code-template-end */
  ],

  // Node.js app
  port: process.env.PORT || 80,

  api: {
    url: process.env.API_URL || 'http://139.59.175.153:8081/api/v1',
  },

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID || '',
  },
}
