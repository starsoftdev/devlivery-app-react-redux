import React from 'react'
import PropTypes from 'prop-types'
import serialize from 'serialize-javascript'
import config from '../config'

/* eslint-disable react/no-danger */

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    styles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      cssText: PropTypes.string.isRequired,
    }).isRequired),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    app: PropTypes.object, // eslint-disable-line
    children: PropTypes.string.isRequired,
  }

  static defaultProps = {
    styles: [],
    scripts: [],
  }

  render() {
    const {title, description, styles, scripts, app, children} = this.props
    return (
      <html className="no-js" lang={app.locale}>
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        {scripts.map(script => <link key={script} rel="preload" href={script} as="script"/>)}
        <link rel="icon" href="/favicon.ico?v1" type="image/x-icon"/>
        {styles.map(style =>
          <style
            key={style.id}
            id={style.id}
            dangerouslySetInnerHTML={{__html: style.cssText}}
          />
        )}
      </head>
      <body>
      <div id="app" dangerouslySetInnerHTML={{__html: children}}/>
      <script dangerouslySetInnerHTML={{__html: `window.App=${serialize(app)}`}}/>
      <script dangerouslySetInnerHTML={{__html: `window.$crisp=[];window.CRISP_WEBSITE_ID=${serialize(config.CRISP_WEBSITE_ID)};(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}}/>
      
      {scripts.map(script => <script key={script} src={script}/>)}
      </body>
      </html>
    )
  }
}

export default Html
