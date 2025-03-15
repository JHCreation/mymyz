import * as React from 'react';
import TextInput from '@/components/inputs/TextInput';
import DynamicTextInput from '~/components/inputs/.client/DynamicTextInput';
import _ from 'lodash';
import guidQ1 from '@/utils/validate/guid';
import { SchemParamProps, SchemProps, ValidateCheckStatus, ValidateMsgProps} from '@/@types/dataSchemas';
import { phoneCheck, replacePhone, phoneAutoHyphen, emailCheck } from '@/utils/validate/check-validate';
import { CustomCellRendererProps } from 'ag-grid-react';

import { ValueFormatterParams, ValueParserLiteParams } from 'ag-grid-community';
import { parseISO, format } from 'date-fns';
import FileInput from '~/components/inputs/.client/FileInput';
import { useCategoryState } from '~/store/store';

import queryOptions from "~/api/category/queryOption";
import CheckInput from '~/components/inputs/CheckInput';
import EditorInput from '~/components/inputs/EditorInput';

const { useState, useEffect, useContext, useCallback, useMemo }= React;

type Props= {
  data?: any
  keyname?: string
  option?: object
}

export default function useSchemas ({ keyname, option }: Props) {
  const { data: category, getCategory }= useCategoryState()
  useMemo(async ()=> {
    if( !category ) getCategory()
  }, [])
  const [schema, setSchema]= useState<any>(null);
  const init= 
  useCallback(
    ()=> {
      console.log(category)
      const schm= getDefaultSchema({ keyname, category, option })
      setSchema(schm);
    }
  , [category])
  
  useMemo(()=> {
    if( category ){
      init()
    }
  }, [category])


  return {schema, setSchema, getDefaultSchema, init, category};
}



export const getDefaultSchema= ({ keyname, category, option }: SchemParamProps)=> {
  const defaultValue:SchemProps= {
    [`id`]: {
      key: `id`,
      name: '아이디',
      value: guidQ1(),
      validate: [ { value: 'pass', } ],
      disabled: true,
      disableFilter: true,
      // component: <TextInput />,
      order: 0,
      column: {
        props: {
          width: 60,
        }
      },
      update: {
        component: <TextInput />
      }
    },
    [`key`]: {
      key: `key`,
      name: '키',
      value: guidQ1(),
      // disabled: true,
      required: true,
      validate: [
        { value: true, }
      ],
      helperText: true,
      disableFilter: true,
      component: <TextInput />,
      order: 0,
      column: {
        props: {
          width: 150,
          // checkboxSelection: true
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [],
          },
        }
      },
      disabled: true,
      update: {
        disabled: true,
      }
    },
    
    [`title`]: {
      key: `title`,
      name: '제목',
      value: '',
      validate: [
        { value: 'empty' }
      ],
      // maxLen: 100,
      // required: true,
      helperText: true,
      component: <TextInput/>,
      order: 0,
      column: { 
        type: 'text', 
        props: { 
          width: 50,
          editable: true,
          filter: true
        } 
      },
    },

    [`content`]: {
      key: `content`,
      name: '내용',
      value: '',
      validate: [
        { value: 'empty' }
      ],
      // maxLen: 100,
      // required: true,
      helperText: true,
      component: <EditorInput/>,
      order: 0,
      column: { 
        type: 'text', 
        props: { 
          width: 50,
          editable: true,
          filter: true
        } 
      },
    },

    [`create_date`]: {
      key: `create_date`,
      name: '생성일자',
      value: '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 0,
      column: { type: 'text', props: { 
        width: 200,
        cellRenderer: (params: CustomCellRendererProps) => { 
          const date= parseISO(params.data.create_date)
          const str= format(date, 'yyyy-MM-dd')
          return <span>{str}</span>
        } 
      } }
    },
  }
  
  const arr= Object.values(defaultValue)
  // console.log(arr)
  const sorted= _.sortBy(arr, 'order');
  // console.log(sorted)
  const sordtedColumns= {}
  sorted.map( col=> {
    sordtedColumns[col['key']]= col;
  })
  // console.log(sordtedColumns)
  
  
  /* if( override ) {
    // overrideDefault= _.merge(defaultValue, override)
    Object.keys(override).map( idx=> {
      const item= override[idx];
      Object.keys(item).map( key=> {
        // console.log(defaultValue[idx]?.[key], item[key], key)
        if( !_.has(sordtedColumns, idx) ) sordtedColumns[idx]= {}
        if( !_.has(sordtedColumns[idx], key) ) sordtedColumns[idx][key]= {}
        sordtedColumns[idx][key]= item[key];
      })
    })
  }
  let overrideDefault= sordtedColumns; */

  // setValues(sordtedColumns)
  return sordtedColumns;
}



