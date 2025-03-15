

import { useEffect, useMemo, useState } from "react";
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { SetPage } from "~/layout/admin/_grid/GridDataType";

const makeList= ({page, count, siblingCount, boundaryCount})=> {
  const left = Array.from({length: boundaryCount}, (v, i) => i+1);
  if( count <= (siblingCount*2)+(boundaryCount*2)+3) {
    return {
      extend: false,
      page_list: Array.from({length: count}, (v, i) => i+1)
    }
  }
  const pageList:number[]= [ ...left ]
  
  const isStart= page <= boundaryCount+(siblingCount)+2
  const isEnd= page > count-boundaryCount-(siblingCount)-2
  const start = isStart ? 1+boundaryCount : 
    (isEnd ? count-boundaryCount-(siblingCount*2)-1 : page-siblingCount)

  const end = isStart ? 1+(siblingCount*2)+boundaryCount+1 : 
    (isEnd ? count-boundaryCount : page+siblingCount)
  if( !isStart ) pageList.push(0)
  for (let index = start; index <= end; index++) {
    pageList.push(index)
  }
  if( !isEnd ) pageList.push(0)

  const right:number[] = Array.from({length: boundaryCount}, (v, i) => count-boundaryCount+i+1);
  const res= pageList.concat(right)
  return {
    extend: true,
    page_list: res
  }
}

interface BasicPaginationProp {
  compSize?: string
  totalCount: number
  page: number
  size: number
  setPage: SetPage
  setPageSize: SetPage
  perSize?: number[]
  callback?: (page:number, size:number)=> void
  siblingCount?: number
  boundaryCount?: number
}


export default function BasicPagination({ compSize, totalCount, page, setPage, size, setPageSize, perSize, callback, siblingCount, boundaryCount }: BasicPaginationProp) {
  // const count= 10;
  const count= Math.ceil(totalCount/size);
  const siblingCounts= siblingCount ?? 1
  const boundaryCounts= boundaryCount ?? 1
  
  const pageList= useMemo(
    ()=> makeList({page, count, siblingCount:siblingCounts, boundaryCount:boundaryCounts}),
    [page, perSize]
  )

  const handleSize= (e)=> {
    const { target: { value } }= e;
    setPage(1)
    setPageSize(value)
    if( callback ) callback(1, value)
  } 

  const handleLink= (page)=> {
    setPage(page)
    if( callback ) callback(page, size)
  }

  const handlePrev= (e)=> {
    const pg= page-1 < 1 ? 1 : page-1
    setPage(pg)
    handleLink(pg)
  }

  const handleNext= (e)=> {
    const pg= page+1 > count ? count : page+1
    setPage(pg)
    handleLink(pg)
  }

  return (
    <div className="w-full flex justify-between items-center">
      <div className="join">
        {
          pageList.extend && <button className="join-item min-w-[35px] btn btn-xs" onClick={handlePrev}>
            <IconChevronLeft size={12}/>
          </button>
        }

        {
          pageList.page_list.map(i=> {
            if( i == 0 ) return <button key={i} className="join-item min-w-[35px] btn btn-xs btn-disabled">...</button>
            return <button key={i} onClick={e=>handleLink(i)} className={`join-item min-w-[35px] btn btn-xs ${page == i ? 'btn-active' : ''}`}>{i}</button>
          })
        }

        {
          pageList.extend && <button className="join-item min-w-[35px] btn btn-xs" onClick={handleNext}>
            <IconChevronRight size={12}/>
          </button>
        }
      </div>

      {
        perSize &&  
        <div className="">
          <select 
            onChange={handleSize}
            className="select select-bordered select-xs w-full max-w-xs flex items-center"
          >
          {
            perSize.map(size => {
              return <option key={size} className="" value={`${size}`} >{size}</option>
            })
          }
          </select>
        </div>
      }
    </div>
  )
}