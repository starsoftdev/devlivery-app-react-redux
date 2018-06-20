import React from 'react'
import RightArrowIcon from '../../static/right-arrow.svg'
import LeftArrowIcon from '../../static/left-arrow.svg'

const PaginationItem = ({type, el}) => {
  if (type === 'prev') {
    return <a className='ant-pagination-item-link'><LeftArrowIcon/></a>
  } else if (type === 'next') {
    return <a className='ant-pagination-item-link'><RightArrowIcon/></a>
  }
  return el
}

export default PaginationItem
