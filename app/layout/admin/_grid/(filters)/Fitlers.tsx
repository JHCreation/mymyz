import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import FilterSelect from "./FilterSelect";
import { DataListContext } from "../GridDataType";
// import FilterAutoComplete from "./FilterAutoComplete";

export default function Filters ({ children }) {
  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, defaultFilters, category, page, setPage, pageSize, log, reload}= context;
 
  const debouncedSearch= useMemo(()=> _.debounce(reload, 500), [pageSize])
  /* const debouncedSearchDelay= useCallback((delay)=>{
    return _.debounce((filters)=> {
      console.log('debounce: ', filters, pageSize)
      setPage(1)
      mutation.mutate({ 
        data: filters, access_token: log?.access_token, 
        page: 0, size: pageSize 
      })
    }, delay)
  }, [pageSize]) */

  useEffect(()=> {
    debouncedSearch({filters, page: 1, pageSize})
  }, [filters])
  

  const handleInit= ()=> {
    console.log('init click!:', init)
    setInit(true)
    setFilters(defaultFilters)
  }
  const [init, setInit]= useState<boolean>(false)
  useEffect(()=> {
    console.log('init start!:', init)
    return ()=> {
      console.log('init end:', init)
      setInit(false)
    }
  }, [init]);

  return (
    <div className="">
      <div className="btn btn-sm btn-warning w-full mb-1" onClick={handleInit}>초기화</div>
      {children({ init, handleInit, category })}
    </div>
  )
}

export const InputWrap= ({className, children}:{className?:string, children:ReactNode})=> {
  return <div className={`flex flex-col bg-base-300 border border-base-content border-opacity-20 p-2 rounded-btn ${className}`}>{children}</div>
}