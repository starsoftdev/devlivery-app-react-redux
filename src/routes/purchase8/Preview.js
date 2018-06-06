import React from 'react'
import {Carousel, Layout} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Preview.css'
import CloseIcon from '../../static/close.svg'

class Preview extends React.Component {
  render() {
    const {collapsed, onCollapse} = this.props

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
          <Carousel
            loop
            customPaging={() => (
              <div className={s.dotWrapper}>
                <div className={s.dot}/>
              </div>
            )}
          >
            <div>
              <img src={'http://via.placeholder.com/450x250'} className={s.previewImage}/>
            </div>
            <div>
              <img src={'http://via.placeholder.com/450x250'} className={s.previewImage}/>
            </div>
            <div>
              <img src={'http://via.placeholder.com/450x250'} className={s.previewImage}/>
            </div>
          </Carousel>
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
