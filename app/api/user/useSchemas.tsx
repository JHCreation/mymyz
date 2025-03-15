import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
// import CheckboxInput from '@/src/components/_forms/input/CheckboxInput';
import TextInput from '@/components/inputs/TextInput';
// import DynamicTextInput from '@/src/components/_forms/input/DynamicTextInput';
// import FileInput from '@/src/components/_forms/input/FileInput';
// import EditorInput from '@/src/components/_forms/input/EditorInput';
// import SelectInput from '@/src/components/_forms/input/SelectInput';
import _ from 'lodash';

// import { CommContext, AppContext } from '@/src_admin/components/_context';
import guidQ1 from '@/utils/validate/guid';
import { SchemParamProps, SchemProps} from '@/@types/dataSchemas';
import { phoneCheck, replacePhone, phoneAutoHyphen, emailCheck } from '@/utils/validate/check-validate';
import { useCategoryState } from '~/store/store';
// import useSchemasCountry from './useSchemasCountry'


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



export interface ProfileType {
  id: string 
  nickname: string 
  sns_name: string
  age: string 
  gender: string 
  email: string 
  mobile: string 
  birthyear: string 
  birthday: string 
  snsType: string 
  userType?: string
}
export const getDefaultSchema= ({ option, data, override, keyname: name }: SchemParamProps)=> {
  console.log(option)
  // const { category, countryInfo, countryInfoByCode }= schemaProp;
  // const { permission }= comm;
  // const usersId= log.adminsId;
  // const { defaultValue: value }= option
  const value= option?.defaultValue
  // const { id, sns_name, nickname, age, gender, email, mobile, birthyear, birthday, snsType, userType }:ProfileType= value;
  
  const defaultValue:SchemProps= {
    /* [`id`]: {
      key: `id`,
      name: '아이디',
      value: guidQ1(),
      validate: [ { value: 'empty', } ],
      disabled: true,
      disableFilter: true,
      component: <TextInput />,
      order: 0,
    }, */
    [`username`]: {
      key: `username`,
      name: '상호명',
      // value: log?.usersLogInfo?.users_id,
      value: '',
      // disabled: true,
      required: true,
      validate: [ { 
        value: 'empty',
        msg: {
          empty: '',
          true: '',
          null: '필수입력',
        },
      } ],
      helperText: true,
      disableFilter: true,
      component: <TextInput />,
      order: 0
    },
    // [`${name}_country`]: useSchemasCountry({ name, countries: countryInfo?.data, countriesByCode: countryInfoByCode }),
    
    [`sns_name`]: {
      key: `sns_name`,
      name: '회원명',
      value: value?.sns_name || '',
      // disabled: true,
      validate: [
        { 
          value: 'empty',
          msg: {
            empty: '',
            true: '',
            null: '필수입력',
          },
        }
      ],
      // maxLen: 100,
      // required: true,
      helperText: true,
      component: <TextInput/>,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },

    [`email`]: {
      key: `email`,
      name: '이메일',
      value: value?.email || '',
      // disabled: true,
      validate: [
        { 
          value: 'empty',
          check: ({ value, schema, wholeSchema })=> {
            let status:any= emailCheck(value);
            if( value == '' ) { status= 'empty'; }
            return { value, status }
          },
          msg: {
            empty: '',
            true: '',
            null: '필수입력',
            false: '형식이 올바르지 않음'
          },
        }
      ],
      // maxLen: 100,
      // required: true,
      helperText: true,
      placeholder: '이메일을 입력하세요',
      component: <TextInput schema={null} setValue={null}/>,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },


    [`phone`]: {
      key: `phone`,
      name: '연락처',
      value: value?.mobile || '',
      validate: [
        { 
          check: ({ value, schema, wholeSchema })=> {
            let status:any= phoneCheck(value)
            if( value == '' ) { status= 'empty'; }
            return { value: phoneAutoHyphen(value), status }
          },
          value: value?.mobile ? true : 'empty',
          msg: {
            empty: '',
            true: '',
            null: '필수입력',
            false: '형식이 올바르지 않음(숫자만 입력)'
          },
          /* color: {
            null: 'text-green-500',
            false: 'text-blue-100'
          } */
        }
      ],
      maxLen: 13,
      required: true,
      helperText: true,
      placeholder: '010-xxxx-xxxx',
      component: <TextInput/>,
      order: 3,
      column: { type: 'text', props: { width: 100 } }
    },
    [`userid`]: {
      key: `userid`,
      name: '아이디',
      value: value?.id || '',
      validate: [ { value: true, } ],
      helperText: true,
      component: <TextInput />,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },
    [`usertype`]: {
      key: `usertype`,
      name: '회원구분',
      value: value?.userType || '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },
    [`permission`]: {
      key: `permission`,
      name: '회원권한',
      value: 'user',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      // column: { type: 'text', props: { width: 200 } }
    },

    [`sns_type`]: {
      key: `sns_type`,
      name: 'SNS가입 분류',
      value: value?.snsType || '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },
    [`sns_id`]: {
      key: `sns_id`,
      name: 'SNS가입 ID',
      value: value?.id || '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },
    [`sns_gender`]: {
      key: `sns_gender`,
      name: 'SNS가입 성별',
      value: value?.gender || '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },
    [`sns_age`]: {
      key: `sns_age`,
      name: 'SNS가입 연령',
      value: value?.age || '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },
    [`sns_birthyear`]: {
      key: `sns_birthyear`,
      name: 'SNS가입 생년',
      value: value?.birthyear || '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },
    [`sns_birthday`]: {
      key: `sns_birthday`,
      name: 'SNS가입 생일',
      value: value?.birthday || '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },
    [`sns_connect_date`]: {
      key: `sns_connect_date`,
      name: 'SNS가입 접속일',
      value: '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },
    [`nickname`]: {
      key: `nickname`,
      name: 'SNS가입 닉네임',
      value: value?.nickname || '',
      validate: [ { value: true, } ],
      helperText: true,
      order: 3,
      column: { type: 'text', props: { width: 200 } }
    },



    /* [`${name}_doc`]: {
      key: `${name}_doc`,
      name: '이미지',
      type: 'file',
      // defaultValue: notice_thumbs_parse,
      value: [],
      validate: [
        {
          name: 'check',
          check: val=> {
            // console.log(val)
            if( val == 'pass' ) return 'pass';
            if( val == '' ) return 'empty';
            let valid:any= true;
            let totalSize= 0;
            const mimetypes = /image\/png|image\/jpeg|imagesvg\+xml|image\/gif|image\/svg\+xml/;
            if( val.length > 10 ) return 'limitLen';
            val.some( v=> {
              const { type, size }= v.file;
              const result = mimetypes.test(type);
              if( !result ) {
                valid= 'ext';
                return true;
              }
              if( size > 10485760 ) valid= 'limitItem';
              totalSize += size;
            });

            if( valid != true ) return valid;
            if( totalSize > 104857600 ) return 'limitTotal';
            return valid;
          },
          msg: {
            ext: '잘못된 파일 형식(png, jpg, gif, svg 가능)',
            limitItem: '파일하나당 10Mb를 초과할수 없습니다.',
            limitTotal: '총파일이 100Mb를 초과할수 없습니다.',
            limitLen: '총파일수가 10개를 초과할수 없습니다.',
            empty: '',
            true: '',
            false: '2개이상 체크',
            null: '필수입력',
          },
          value: 'pass',
        }
      ],
      multiple: true,
      // range: statusSchema,
      // required: true,
      helperText: true,
      thumbWidth: 87.3,
      disableFilter: true,
      uploadPath: `/data/${name}`,
      // component: <FileList />,
      component: <FileInput schema={null} setValue={null} color='secondary'/>,
      // order: 1
    }, */
  }
  
  const arr= Object.values(defaultValue)
  const sorted= _.sortBy(arr, 'order');
  const sordtedColumns= {}
  sorted.map( col=> {
    const key= col['key'];
    sordtedColumns[col['key']]= col;
  })
  
  
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



