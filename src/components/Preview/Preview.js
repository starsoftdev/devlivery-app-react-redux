import React from 'react'
import {Carousel, Layout} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Preview.css'
import CloseIcon from '../../static/close.svg'
import Magnifier from 'react-magnifier';
import { injectGlobal } from 'styled-components';

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
  triggerResizeEvent(){
    // This can be your element on which to trigger the event
    var el = document; 
    var event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    el.dispatchEvent(event);
  }
  render() {
    const {collapsed, onCollapse, item, imagesProp, header} = this.props
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
    this.triggerResizeEvent();
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
              this.triggerResizeEvent();
            }}
          >
            {images.map((image, i) => image.url ? (
              <Magnifier key={i} src={image.url} width={'100%'} />
              ) : null
            )}
          </Carousel>
          {item.title && (
            <p className={s.previewDescription}>
              {item.title}
            </p>
          )}
          {item.short_description && (
            <p className={s.previewShortDescription}>
              {item.short_description}
            </p>
          )}
        </section>
      </Layout.Sider>
    ) : null
  }
}

export default withStyles(s)(Preview)
