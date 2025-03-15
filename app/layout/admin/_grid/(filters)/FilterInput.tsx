import { GroupFilterType } from "@/utils/data/filterQry";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { searchTree } from "@/utils/data/filterQry"; 
import _ from "lodash"
import { DataListContext } from "../GridDataType";




export default function FilterInput ({ className, init, id }:{ className?:string, init:boolean, id:string[] }) {
  
  const thisFilterId= id.join('_')
  const thisFilter:GroupFilterType= {
    type: "group",
    id: thisFilterId,
    operator: "OR",
    filter: []
  }

  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, setFilters}= context;
  const [input, setInput]= useState('')
  useEffect(()=> {
    if( init ) {
      setInput('')
    }
  }, [init])
  
  const go= useRef(true)
  const handleChange= (e)=>  {
    const { target : { value } }= e;
    setInput(value)
    // debouncedInput(value)
    setFilters((filters)=> {
      const filtersCopy= _.cloneDeep(filters);
      go.current= true
      const updateFilters= searchTree({node: filtersCopy, id: filterId, go, set: (node)=> {
        if( node.type == 'group' ){

          let currentFilter= node?.filter.find(f=> f.id == thisFilterId);
          if( !currentFilter ) {
            node.filter= node.filter.concat(thisFilter)
            currentFilter= node?.filter.find(f=> f.id == thisFilterId);
          }
          if( currentFilter && currentFilter.type == 'group' ){

            const filtering= currentFilter?.filter.filter(ft=> {
              const obj= id.find(v=> ft.id == v)
              return obj ? false : true
            });
            
            const input= filtering.concat(id.map(id=> ({
              type: "filter",
              id,
              option: "LIKE",
              key: id,
              value,
            })))
            currentFilter.filter= input
            if( value == '' ) currentFilter.filter= []
            
            const currentFiltering= node?.filter.filter(f=> f.id != thisFilterId);
            node.filter= currentFiltering.concat(currentFilter)
          }
        }
        
        return node
      }});
      console.log(updateFilters)
      return updateFilters
    })
  }


  return (
    <input 
      className={`input input-xs w-full ${className}`}
      onChange={handleChange}
      value={input}
    />
  )
}