// 'use client'
import { GroupFilterType, OperatorType } from "@/utils/data/filterQry";
// import { Checkbox } from "@material-tailwind/react";
import { useContext, useEffect, useRef, useState } from "react";
import { searchTree } from "@/utils/data/filterQry"; 
import _ from "lodash"

// import { DataListContext } from "../../category/CategoryData";
import { generateUID } from "@/utils/validate/guid";
import { Loading } from "@/components/ui/Loading";
import { DataListContext } from "../GridDataType";

  
// const filterCheckId= `${generateUID()}`;


interface FilterCheckProps  {
  init: boolean
  id: string
  option: any
  operator: OperatorType
}
export default function FilterCheck ({ init, id, option, operator }:FilterCheckProps) {
  const filterCheckId= id;
  const checkFilter:GroupFilterType= {
    type: "group",
    id: filterCheckId,
    operator: "OR",
    filter: []
  }
  // checkFilter.id= filterCheckId

  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, category, setPage}= context;
  
  const [input, setInput]= useState<any[]>([])
  useEffect(()=> {
    // console.log('check:', init)
    if( init ) setInput([])
  }, [init])

  const go= useRef(true)

  const setFilterFn= ({value, checked})=> {
    console.log(filterCheckId)
    setFilters((filters)=> {
      const filtersCopy= _.cloneDeep(filters);
      go.current= true
      const updateFilters= searchTree({node: filtersCopy, id: filterId, go, set: (node)=> {
        if( node.type == 'group' ){
          let currentFilter= node?.filter.find(f=> f.id == filterCheckId);
          if( !currentFilter ) {
            node.filter= node.filter.concat(_.cloneDeep(checkFilter))
            currentFilter= node?.filter.find(f=> f.id == filterCheckId);
          }
          if( currentFilter && currentFilter.type == 'group' ){

            const filtering= currentFilter?.filter.filter(f=> f.id != value);
            let checks= filtering;
            if( checked ) {
              checks= filtering.concat({
                type: "filter",
                id: value,
                option: operator || '=',
                key: filterCheckId,
                value: value,
              })
            }
            currentFilter.filter= checks;

            const filteringCheck= node?.filter.filter(f=> f.id != filterCheckId);
            node.filter= filteringCheck.concat(currentFilter)
          }
          
        }
        return node
      }});

      /* setInput(input=> {
        let filterCheck= input.filter(v=> v != val.id)
        if( checked ) filterCheck= filterCheck.concat(val.id)
        console.log(filterCheck)
        return filterCheck;
      }) */
      console.log(updateFilters)
      return updateFilters
    })
  }


  const handleChange= (val)=> (e)=>  {
    const checking= input.find(check=> _.isEqual(check, val))
    let checked= false
    if( !checking ) {
      checked= true
    }
    console.log('checked', checked, val)
    setFilterFn({value: val, checked})

    setInput(input=> {
      let filterCheck;
      const checking= input.find(check=> _.isEqual(check, val))
      let checked= false
      if( checking ) {
        filterCheck= input.filter(d=> !_.isEqual(d, val))
      }
      if( !checking ) {
        filterCheck= input.concat([val])
        checked= true
      }
      
      return filterCheck;
    })
    

  }

  if( !option ) return (
    <div className="">
      <Loading className="w-5"/>
    </div>
  )

  return (
    option && 
    <div className="">
      <p className="">{option.name}</p>
      <div className="flex">
        {
          option?.value.map((val)=> (
            <div key={val.id} className="form-control mr-3">
              <label className="cursor-pointer label">
                <input 
                  type="checkbox"
                  key={val.id}
                  className="checkbox checkbox-xs checkbox-accent"
                  onChange={handleChange(val.id)}
                  checked={input.find(input=> _.isEqual(input, val.id)) ?? false}
                />
                <span className="label-text ml-1">{val.key}</span>
              </label>
            </div>

              
          ))
        }
      </div>
    </div>
  )
}