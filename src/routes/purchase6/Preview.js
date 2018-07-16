import React from 'react'
import {Layout} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Preview.css'
import CloseIcon from '../../static/close.svg'

class Preview extends React.Component {
  render() {
    const {collapsed, onCollapse, content, cardSize} = this.props

    let scale = 1
    let ratio = 1

    const deviceRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    const wrapperWidth = 356 // hardcoded wrapper width in pixels
    const wrapperWidthInMM = wrapperWidth * 25.4 / (96 * deviceRatio)
    if (cardSize) {
      scale = wrapperWidthInMM / cardSize.width
      ratio = cardSize.width / cardSize.height
    }

    return (
      <Layout.Sider
        className={s.previewWrapper}
        breakpoint='xl'
        collapsedWidth={0}
        onCollapse={onCollapse}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <section className={s.preview}>
          <a onClick={() => onCollapse(true)} className={s.closeBtn}>
            <CloseIcon/>
          </a>
          <h3 className={s.previewHeader}>
            Card Preview
          </h3>
          {cardSize && (
            <div
              className={s.contentWrapper}
              style={{
                width: wrapperWidth,
                maxHeight: wrapperWidth / ratio,
              }}
            >
              <iframe
                style={{
                  width: `${cardSize.width}mm`,
                  height: `${cardSize.height}mm`,
                  transform: `scale(${scale})`
                }}
                srcDoc={content}
                className={s.content}
              />
            </div>
          )}
          <p className={s.previewDescription}>
            It has survived not only five centuries, but also the leap into electronic typesetting, remaining
            essentially unchanged. It was popularised.
          </p>
        </section>
      </Layout.Sider>
    )
  }
}

export default withStyles(s)(Preview)
