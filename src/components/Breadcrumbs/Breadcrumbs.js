import React from 'react'
import {Breadcrumb} from 'antd'
import {Link} from '../../components'

const Breadcrumbs = ({breadcrumbs, ...props}) =>
  <Breadcrumb separator='◆' {...props}>
    {breadcrumbs.map((breadcrumb, i) => {
      return (
        <Breadcrumb.Item key={i}>
          {breadcrumb.routeName ? (
            <Link to={breadcrumb.routeName}>
              {breadcrumb.name}
            </Link>
          ) : (
            <span>{breadcrumb.name}</span>
          )}
        </Breadcrumb.Item>
      )
    })}
  </Breadcrumb>

export default Breadcrumbs
