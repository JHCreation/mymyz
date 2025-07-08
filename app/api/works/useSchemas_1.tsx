import * as React from 'react';
import TextInput from '@/components/inputs/TextInput';
import DynamicTextInput from '~/components/inputs/.client/DynamicTextInput';
import _ from 'lodash';
import guidQ1 from '@/utils/validate/guid';
import { defineFields, defineModel, GetDataType, InferFieldType, SchemParamProps, SchemProps, ValidateCheckStatus, ValidateMsgProps} from '@/@types/dataSchemas';
import { phoneCheck, replacePhone, phoneAutoHyphen, emailCheck } from '@/utils/validate/check-validate';
import { CustomCellRendererProps } from 'ag-grid-react';

import { ValueFormatterParams, ValueParserLiteParams } from 'ag-grid-community';
import { parseISO, format } from 'date-fns';
import FileInput from '~/components/inputs/.client/FileInput';
import { useCategoryState } from '~/store/store';

import queryOptions from "~/api/category/queryOption";
import CheckInput from '~/components/inputs/CheckInput';
import EditorInput from '~/components/inputs/EditorInput';
import { z } from 'zod';

const { useState, useEffect, useContext, useCallback, useMemo }= React;

type Props= {
  data?: any
  keyname?: string
  option?: object
}

export type DefaultSchema= {
  schema: SchemProps|undefined
  setSchema: any
  getDefaultSchema: any
  init: any
  category: any
  create: any
}
export default function useSchemas_1 ({ keyname, option }: Props):DefaultSchema {
  const { data: category, getCategory }= useCategoryState()
  useMemo(async ()=> {
    if( !category ) getCategory()
  }, [])
  const [schema, setSchema]= useState<SchemProps>();
  const [create, setCreate]= useState<any>(null);
  const init= 
  useCallback(
    ()=> {
      console.log(category)
      const {schm, create}= getDefaultSchema({ keyname, category, option })
      setSchema(schm);
      setCreate(create)
      // type UserData = Parameters<typeof create>[0]
    }
  , [category])
  
  useMemo(()=> {
    if( category ){
      init()
    }
  }, [category])


  return {schema, setSchema, getDefaultSchema, init, category, create};
}


const setDefaultSchema= ({ keyname, category, option }: SchemParamProps)=> {
  const { defs, create }= defineModel({
    [`id`]: {
      key: `id`,
      type: 'text',
      // type: z.string().nonempty("필수입력"),
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
      type: 'text',
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
      type: 'text',
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
      type: 'text',
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

    [`thumb`]: {
      key: `thumb`,
      name: '썸네일',
      type: 'file',
      // defaultValue: notice_thumbs_parse,
      value: [],
      validate: [
        {
          name: 'check',
          check: ({ value, schema, wholeSchema })=> {
            let status:ValidateCheckStatus= true;
            status= value.length == 0 ? 'empty' : true;
            let totalSize= 0;
            const mimetypes = /image\/png|image\/jpeg|image\/gif|image\/svg\+xml|image\/webp/;
            if( value.length > 10 ) return { value: value, status: 'limitLen' };
            value.some( v=> {
              if( !v?.file ) return true
              const { type, size }= v?.file;
              const result = mimetypes.test(type);
              console.log(type, result)
              if( !result ) {
                status= 'ext';
                return true;
              }
              if( size > 10485760 ) status= 'limitItem';
              totalSize += size;
            });

            if( status != true ) return { value: value, status };
            if( totalSize > 104857600 ) return { value: value, status: 'limitTotal' };
            return { value: value, status };
          },
          msg: {
            ext: '잘못된 파일 형식(png, jpg, gif, svg 가능)',
            limitItem: '파일하나당 10Mb를 초과할수 없습니다.',
            limitTotal: '총파일이 100Mb를 초과할수 없습니다.',
            limitLen: '총파일수가 10개를 초과할수 없습니다.',
            empty: '',
            true: '',
            false: '2개이상 체크',
            null: '필수등록',
          },
          value: 'empty',
        }
      ],
      multiple: true,
      // range: statusSchema,
      required: true,
      helperText: true,
      thumbWidth: 94.8,
      disableFilter: true,
      uploadPath: `/${keyname}`,
      // component: <FileList />,
      component: <FileInput />,
      /* update: {
        component: <FileList />
      } */
      // order: 1
    },

    [`create_date`]: {
      key: `create_date`,
      type: 'text',
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
  })
  // const fields:SchemProps = defaultValue

  return { defs, create }
}


export const getDefaultSchema= ({ keyname, category, option }: SchemParamProps)=> {
  const def= setDefaultSchema({ keyname, category, option })
  const { defs:defaultValue, create }= def
  /* type FieldsType = {
    [K in keyof typeof defaultValue]: InferFieldType<
      typeof defaultValue[K]['type']
    >;
  }; */
  
  const arr= Object.values(defaultValue)
  // console.log(arr)
  const sorted= _.sortBy(arr, 'order');
  // console.log(sorted)
  const sordtedColumns: typeof defaultValue|{}= {}
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
  return { schm: sordtedColumns, create };
}

