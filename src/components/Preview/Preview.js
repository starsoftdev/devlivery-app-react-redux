import React from 'react'
import {Carousel, Layout} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Preview.css'
import CloseIcon from '../../static/close.svg'

class Preview extends React.Component {
  render() {
    const {collapsed, onCollapse, item, imagesProp, header} = this.props
    return item ? (
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
            {header}
          </h3>
          <Carousel
            loop
            customPaging={() => (
              <div className={s.dotWrapper}>
                <div className={s.dot}/>
              </div>
            )}
          >
            {item[imagesProp].map((image, i) => image.url ? (
              <div key={i}>
                <div style={{backgroundImage: `url(${image.url})`}} className={s.previewImage}/>
              </div>
              ) : null
            )}
          </Carousel>
          {item.description && (
            <p className={s.previewDescription}>
              {item.description}
            </p>
          )}
        </section>
      </Layout.Sider>
    ) : null
  }
}

export default withStyles(s)(Preview)
