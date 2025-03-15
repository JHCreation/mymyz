import { useState, useEffect, useRef, useContext, } from 'react';
// import { CommContext } from '@/src_admin/components/_context';
// import useSchemas from '../useSchemas';
// import { sha256 } from 'js-sha256';
// import { useUploadFiles } from 'hooks/files/useFiles';
// import { useAnyPostQuery } from 'hooks/_query/useAnyQuery';
// import { readFileAsText } from '@/src/module/jhc-files';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import path from 'path-browserify';


// import { usePostAny, useUploadFiles, createFileNames } from '@/src_admin/components/_datas/CRUD/useAny';
import _ from 'lodash';

type Props = {
  wrapper?: any
  body?: any
  onSubmit: ({data, file})=> void
  callback?: ( data?: any )=> void,
  asyncCallback?: ( params?: any )=> void
  keyname?: string
  // useSchemas: any
  ctx?: any
  option?: any
  schema: any
  setSchema: any
}

export default function useCreate ({ wrapper, body, onSubmit, callback, asyncCallback, keyname: name, schema, setSchema, option }: Props) {
  // const comm= ctx ? ctx : useContext(CommContext)
  // const { log, permission, domain } = comm;
  // const usersLogInfo = log?.usersLogInfo;
  
  const [save, setSave]= useState(false)
  const [loading, setLoading]= useState(false);

  // const {schema, setValues, init}:any= useSchemas({name, option});
  // const { request: createReq, datas: createDatas, setDatas: setCreateDatas, loading: createLoading, err: createErr }:any= usePostAny();
  // const { request: uploadFilesReq, datas: uploadFilesDatas, loading: uploadFilesLoading, err: uploadFilesErr }:any= useUploadFiles();
  // console.log(schema)

  const [params, setParams]= useState<any>(null);
  /* useEffect( ()=> {
    // console.log(createDatas)
    if( createDatas ) {
      setSave(true);
      init();
      setCreateDatas(null);
      callback && callback(params);
    }
    if( createErr ) console.log(createErr)
  }, [createDatas, createErr] );

  useEffect( ()=> {
    if( !createLoading || !uploadFilesLoading ) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    // setLoading(createLoading);
  }, [createLoading, uploadFilesLoading]) */

  
  /* useEffect( ()=> {
    console.log(uploadFilesData)
    if( uploadFilesData ) {
      setSave(true)
      callback()
    }
    if( uploadFilesErr ) console.log(uploadFilesErr)
  }, [uploadFilesData, uploadFilesErr] ); */

  /* useEffect( ()=> {
    if( !createUsersLoading || !uploadFilesLoading ) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    // setLoading(createUsersLoading);
  }, [createUsersLoading, uploadFilesLoading]) */

  const handleSubmit= (e)=> {
    const schmKeys= Object.keys(schema);
    let check= true;
    const datas= {};
    const files= {};

    schmKeys.map( key=> {
      const data= schema[key];
      const { required, value, validate, type }= data;
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

      if( (is && !passed) ) {
        switch (key) {
          default:
            // 파일일경우
            if( type == 'file' ) {
              const fileDatas= createFileNames({data, id: [`${name}_id`], schema, key, method: 'add'});
              // console.log(fileDatas)
              files[key]= fileDatas;
              // files[key]= fileDatas.file;
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

    console.log( check, datas, schema, wrapper )

    if( !check ) {
      if( wrapper ) {
        wrapper.current.scrollTo({
          top: body.current.getBoundingClientRect().top + window.pageYOffset - 75,
          behavior: "smooth"
        });
      } else {
        window.scrollTo({
          top: body.current.getBoundingClientRect().top + window.pageYOffset - 75,
          behavior: "smooth"
        });
      }
    } else {
      onSubmit({ data: datas, file: files })
      // console.log('success', datas);
      asyncCallback && asyncCallback({ data: datas, file: files });
      // return;
      // createReq({ name, params: datas })
      // if( !_.isEmpty(files) ) uploadFilesReq({ files, });
    }
      
  }

  
  return { handleSubmit, schema, setSchema, loading, setLoading, save, setSave }
}






export function createFileNames ({data, id, schema, key, method}) {
  const now= format(new Date(), 'yyyyMMddHHmmss');
  const idKey= schema[id].value;
  const uploadPath= `${data.uploadPath}/${idKey}/${key}`;
  const fileData:any= {
    names: null,
    file: null,
    uploadPath,
    method
  }
  fileData.names= [];
  fileData.file= data.value.map((val, idx)=> {
    const { file }= val;
    const uploadRootPath= `${data.uploadPath}`;
    const ext= path.extname(file.name);
    const base= file.name.split(ext)[0];
    const fileName= `${now}_${idx.zf(2)}_${base}`;
    const name= `${fileName}${ext}`;
    const uploadFullPath= `${uploadPath}${name}`;
    // const method= 'add';

    fileData.names.push(`${uploadPath}/${name}`);
    return {
      ...val,
      name,
      uploadPath,
      uploadFullPath,
      uploadRootPath,
      method
    }
  });
  return fileData;
}