// 'use client'
import { GroupFilterType } from "@/utils/data/filterQry";
// import { Checkbox, Option } from "@material-tailwind/react";
import { useContext, useEffect, useRef, useState } from "react";
import { searchTree } from "@/utils/data/filterQry"; 
import _ from "lodash"

// import { DataListContext } from "../../category/CategoryData";
import { generateUID } from "@/utils/validate/guid";
import { Select } from "@/components/ui/Select"
import { Loading } from "@/components/ui/Loading";
// import AutocompleteInput from "@/components/ui/AutoComplete";
import AutocompleteInputs from "@/components/ui/AutoCompletes";
import { DataListContext } from "../GridDataType";

const filterCheckId= `${generateUID()}`;
const selectFilter:GroupFilterType= {
  type: "group",
  id: filterCheckId,
  operator: "OR",
  filter: []
}
export default function FilterAutoComplete ({ init }) {

  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, category, setPage}= context;
  const categoryItem= category['status']

  const [input, setInput]= useState<any>(null)
  useEffect(()=> {
    console.log('select:', init)
    if( init ) setInput(null)
  }, [init])

  const go= useRef(true)
  const handleChange= (value)=>  {
    const val= JSON.parse(value);
    console.log(val)
    setInput(val)
    setFilters((filters)=> {
      const filtersCopy= _.cloneDeep(filters);
      go.current= true
      const updateFilters= searchTree({node: filtersCopy, id: filterId, go, set: (node)=> {
        if( node.type == 'group' ){
          let currentFilter= node?.filter.find(f=> f.id == filterCheckId);
          if( !currentFilter ) {
            node.filter= node.filter.concat(_.cloneDeep(selectFilter))
            currentFilter= node?.filter.find(f=> f.id == filterCheckId);
          }
          if( currentFilter && currentFilter.type == 'group' ){
            currentFilter.filter= [{
              type: "filter",
              id: val.id,
              option: "=",
              key: categoryItem.key,
              value: val.value,
            }];
            const filteringCheck= node?.filter.filter(f=> f.id != filterCheckId);
            node.filter= filteringCheck.concat(currentFilter)
          }
          
        }
        return node
      }});


      return updateFilters
    })


  }
  
  if( !categoryItem ) return (
    <div className="">
      <Loading className="w-5"/>
    </div>
  )
  return (
    categoryItem && 
    <>
    <div className="w-[200px]">
    {/* <AutocompleteInput /> */}
    <AutocompleteInputs/>
    </div>
    {/* <Select 
      onChange={handleChange}
      label={categoryItem.name} 
      // size={`${matches ? 'sm' : 'md'}`} 
      size={`sm`}
      value={input ? JSON.stringify(input) : ''}
      selected={(el)=> {
        if( !input ) return undefined
        return (
          <div className="">{input?.key}</div>
        )
      }}
    >
    {
      categoryItem?.value.map(val => {
        return <Option key={val.id} className="p-1" value={JSON.stringify(val)} >{val.key}</Option>
      })
    }
    </Select> */}
    </>
  )
}