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
  port: process.env.PORT || 8080,

  api: {
    url: process.env.API_URL || 'https://byzumi.com:8081/api/v1',
  },

  stripe: {
    apiKey: 'pk_test_RZuClDNHgWzhvxegdoj5TVLt', // 'pk_live_QEkY8wy4qeiwxBZY997MYj3Y' (live)
  },

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID || '',
  },

  CRISP_WEBSITE_ID : "04f29a7b-be7d-426c-a123-98eedbbdeffa"
}
