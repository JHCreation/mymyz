// import { useUploadFiles } from 'hooks/files/useFiles';
// import { readFileAsText } from '@/src/module/jhc-files';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import path from 'path-browserify';
import _ from 'lodash';
import { isEmptyArray } from '@/utils/validate/utility';

type Props = {
  wrapper?: any
  body?: any
  schema: any
  setSchema: any
  method?: 'create'|'update'
  option?: any
}
export default function useValidate ({ wrapper, body, schema, setSchema, method, option }: Props) {
  
  const handleValidate= ()=> {
    const schmKeys= Object.keys(schema);
    let check= true;
    const datas= {};
    const files= {};

    schmKeys.map( key=> {
      const schemaItem= schema[key];
      const { required, value, validate, type }= schemaItem;
      
      let is= true;
      let passed= false;

      if( required ) {
        if( typeof value == 'object' && value.length == 0 ) is= false;
        if( value == '' ) is= false;
      }

      const validateCopy= validate.map( (valid)=> {
        if( required ) {
          if( valid.value == 'empty' ) {
            valid.value= null;
            is= false;
          }
          if( valid.value != true ) is= false;
        }
        if( !required ) {
          if( valid.value != true && valid.value != 'empty' ) is= false;
        }
        if( valid.value == 'pass' ) passed= is= true;
        /* if( required && valid.value == 'empty' ) {
          valid.value= null;
          is= false;
        } */
        // if( required && valid.value != true ) is= false;
        // if( valid.value == 'pass' ) passed= is= true;

        return valid;
      })
      console.log(key, validateCopy)

      if( (is && !passed) ) {
        switch (key) {
          default:
            // 파일일경우
            if( type == 'file' ) {
              const fileDatas= createFileNames({data: schemaItem, id: `key`, schema, key, method: 'add'});
              if( schemaItem?.defaultValue && isEmptyArray(schemaItem?.defaultValue) && isEmptyArray(value)
              ) return;
              files[key]= fileDatas;
              // console.log(schemaItem?.defaultValue, value, fileDatas.file)
              datas[key]= JSON.stringify(fileDatas.names);
              return;
            }

            // 객체일경우 문자로
            if( typeof value == 'object' ) datas[key]= JSON.stringify(value);
            else { datas[key]= value; }
            break;
        }
      }

      // console.log(key, is, value)


      if( !is ) {
        setSchema(val=> {
          return {
            ...val,
            [key]: {
              ...val[key],
              validate: validateCopy,
            }
          }
        });
        check= false;
      }
    })

    // console.log( check, datas, schema, wrapper )
    let status= '정상입니다.';

    if( !check ) {
      status= '유효하지 않는 값이 있습니다.';
      if( wrapper ) {
        wrapper.current.scrollTo({
          top: body.current.getBoundingClientRect().top + window.scrollY - 75,
          behavior: "smooth"
        });
      } 
      if( body ) {
        window.scrollTo({
          top: body.current.getBoundingClientRect().top + window.scrollY - 75,
          behavior: "smooth"
        });
      }
    } 

    if( method == 'update' && Object.keys(datas).length === 0 ) {
      status= '수정된 내용이 없습니다.'
      check= false
    }

    

    return { check, data: datas, file: files, schema, status }
  }

  
  return { handleValidate }
}






export function createFileNames ({data, id, schema, key, method}) {
  const now= format(new Date(), 'yyyyMMddHHmmss');
  const idKey= schema[id].value;
  const uploadPath= `${data.uploadPath}/${idKey}/${key}`;
  console.log(data, idKey, uploadPath)
  const fileData:any= {
    names: null,
    file: null,
    uploadPath,
    method,
    schema: schema[key]
  }
  fileData.names= [];
  fileData.file= data.value.map((val, idx)=> {
    const { file }= val;
    const uploadRootPath= `${data.uploadPath}`;
    const ext= path.extname(file.name);
    const base= file.name.split(ext)[0];
    const fileName= `${now}_${`${idx}`.padStart(2, '0')}_${base}`;
    const name= `${fileName}${ext}`;
    const uploadFullPath= `${uploadPath}/${name}`;
    // const method= 'add';

    fileData.names.push(`${uploadPath}/${name}`);
    return {
      ...val,
      name,
      uploadPath,
      uploadFullPath,
      uploadRootPath,
      method,
    }
  });
  return fileData;
}