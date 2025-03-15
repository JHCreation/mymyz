import  { forwardRef, useCallback, useContext, useEffect,  useRef, useState } from "react";

import { addDays, format } from "date-fns";
import { DateRange, DayPicker, getDefaultClassNames } from "react-day-picker";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { ko } from "date-fns/locale";
// import { generateUID } from "@/utils/validate/guid";
import { GroupFilterType, searchTree } from "@/utils/data/filterQry";
// import { DataListContext } from "../../category/CategoryData";
import _ from "lodash";
import "react-day-picker/style.css";
import "./day-picker-style.css"
// import classNames from "react-day-picker/style.module.css";
// import {arrow, limitShift, useFloating, useFocus} from '@floating-ui/react';
import { Portal } from "~/components/ui/Popover";
import { DataListContext } from "../GridDataType";



export default function FilterDate({ init, id }) {
  const thisFilterId= id;
  const thisFilter:GroupFilterType= {
    type: "group",
    id: thisFilterId,
    operator: "AND",
    filter: []
  }
  const inputId_1= `${id}-start`
  const inputId_2= `${id}-end`

  
  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, category, setPage}= context;

  // const [date, setDate] = useState<Date>();
  const [range, setRange] = useState<DateRange | undefined>();
  const [updateRange, setUpdateRange] = useState<DateRange | undefined>();
  const [viewDate, setViewDate] = useState<string>('')
  useEffect(()=> {
    if( init ) clear()
  }, [init])

  const go= useRef(true)
  const update= useCallback(({from, to}:any)=> {
    console.log('date input: ', from, to)
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
            const filtering= currentFilter?.filter.filter(f=> f.id != inputId_1 && f.id != inputId_2);
            const input= filtering.concat([
              {
                type: "filter",
                id: inputId_1,
                option: ">",
                key: thisFilterId,
                value: from,
              },
              {
                type: "filter",
                id: inputId_2,
                option: "<",
                key: thisFilterId,
                value: to,
              },
            ])
            currentFilter.filter= input
            if( !from || !to ) currentFilter.filter= filtering
            // console.log(input, filtering, currentFilter)
            
            const currentFiltering= node?.filter.filter(f=> f.id != thisFilterId);
            node.filter= currentFiltering.concat(currentFilter)
          }
        }
        
        return node
      }});

      return updateFilters
    })
    
  }, [])

  const handleClear= (e)=> {
    update({from: '', to: ''})
    clear()
  }
  const clear= ()=> {
    setRange(undefined)
    setUpdateRange(undefined)
    setViewDate('')
    setOpen(false)
  }
  const onSelect= (range)=> {
    setRange(range)
    const value= range ? (`${range?.from ? format(range.from, "yyyy-MM-dd"): ''} - ${range?.to ? format(range.to, "yyyy-MM-dd"): ''}`) : ''
    setViewDate(value)
  }
  const handleUpdate= (e)=> {
    if( !range?.from ) return;
    if( !range?.to ) return;
    const fromStr= format(addDays(range.from, -1), "yyyy-MM-dd");
    const toStr= format(addDays(range.to, 1), "yyyy-MM-dd");
    
    setOpen(false)
    setUpdateRange(range)
    update({ from: fromStr, to: toStr })
  }
  const [open, setOpen]= useState(false)

  useEffect(()=> {
    if( !open ) onSelect(updateRange)
  }, [open])

  /* const [value, setValue] = useState<any|undefined>({ 
    startDate: null, 
    endDate: null
  }); */


  const Input= forwardRef((props, ref:any)=> {
    /* return (
      <div className="btn" ref={ref} {...props}>
        버튼
      </div>
    ) */
    console.log(props)
    return <div className="relative">
      <input 
        ref={ref}
        {...props} type="text" 
        className="input input-xs w-full"
        placeholder="날짜"
        onChange={() => null}
        value={viewDate}
      />
      {
        viewDate && 
        <IconX size={12} className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer stroke-base-content hover:opacity-55" 
          onClick={handleClear}
        />
      }
      
    </div>
  })
  
  const defaultClassNames = getDefaultClassNames();
  return (
    <>
    <Portal InputEl={Input} setOpen={setOpen} open={open} arrowClassName={'border-base-200'} >
      <div className="bg-base-200 p-3">
            
        <DayPicker
          locale={ko}
          // mode="single"
          // selected={date}
          // onSelect={setDate}
          captionLayout="dropdown"
          mode="range"
          selected={range}
          onSelect={onSelect}
          showOutsideDays
          className="border-0 "
          styles={{
            /* day_button: {
              width: '2em',
              height: '2em',
            } */
          }}
          classNames={{
            root: `${defaultClassNames.root}`,
            month_caption: "flex justify-center mb-2 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "z-50 absolute top-[-.2rem] w-full flex items-center justify-between pointer-events-none",
            button_previous: "relative left-1.5 pointer-events-auto",
            button_next: "relative right-1.5 pointer-events-auto",
            day: `p-0 text-xs`,
            // day_button: `${defaultClassNames.day_button} !w-8 !h-8`,
          }}
          components={{
            Chevron: (props)=> {
              if (props.orientation === "left") {
                return <IconChevronLeft {...props} className="stroke-primary" />;
              }
              if (props.orientation === "right") {
                return <IconChevronRight {...props} className="stroke-primary" />;
              }
              return <></>
            },
            /* DayButton:(props)=> {
              console.log(props)
              return (
                <button {...props} className={`${props.className}`} >{props.children}</button>
              )
            },
            Day:(props)=> {
              // console.log(props)
              return <div {...props} className={`${props.className}`}>{props.children}</div>
            },
            Weeks:(props)=> {
              return <div {...props} className={`${props.className}`}>{props.children}</div>
            },
            Week: (props)=> {
              return <div {...props} className={`${props.className} flex`}>{props.children}</div>
            },
            Weekdays:(props)=> {
              return <div {...props} className={`${props.className}`}>{props.children}</div>
            },
            MonthGrid:(props)=> {
              return <div {...props} className={`${props.className}`}>{props.children}</div>
            }, */
          }}
        />
        
        <div className="border-t border-blue-gray-50 pt-4 flex justify-end">
          <div className="mr-2 btn btn-xs btn-error" onClick={handleClear}>지우기</div>
          <div className="btn btn-xs btn-accent " onClick={handleUpdate}>업데이트</div>
        </div>
      </div>
    </Portal>
      
    
    </>
  );
}