import React from 'react'
import {Carousel, Layout} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Preview.css'
import CloseIcon from '../../static/close.svg'
import Magnifier from 'react-magnifier';
import { injectGlobal } from 'styled-components';
import { triggerResizeEvent } from '../../utils';

injectGlobal`
  .magnifier {
    margin-bottom: 50px;
  }
  
  .magnifier-image {
    min-height: 200px;
  }
  
  .magnifying-glass {
    
  }
`

class Preview extends React.Component {
  render() {
    const {collapsed, onCollapse, item, imagesProp, header, onClickMagnifier,intl} = this.props
    var images =[];
    if(item)
    {
      if(Array.isArray(imagesProp))
      {
        imagesProp.map(name => {
          images = [...images,...item[name]];
        });
      }
      else images = item[imagesProp];
    }
    //this.triggerResizeEvent();
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
            afterChange ={() => {
              triggerResizeEvent();
            }}
          >
            {images.map((image, i) => image.url ? (
              <div key={i} onClick={()=>onClickMagnifier()}>
                <Magnifier key={i} src={image.url} width={'100%'} />
              </div>
              ) : null
            )}
          </Carousel>
          {item.title && (
            <p className={s.previewDescription}>
              {item.title}
            </p>
          )}
          {
            <p className={s.previewShortDescription}>
              {intl.locale === 'de-DE' ? item.short_description_german : item.short_description}
            </p>
          }
        </section>
      </Layout.Sider>
    ) : null
  }
}

export default withStyles(s)(Preview)
