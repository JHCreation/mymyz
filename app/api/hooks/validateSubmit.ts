// import { sha256 } from 'js-sha256';
// import { useUploadFiles } from 'hooks/files/useFiles';
// import { readFileAsText } from '@/src/module/jhc-files';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import path from 'path-browserify';
import _ from 'lodash';

type Props = {
  wrapper?: any
  body?: any
  schema: any
  setSchema: any
  option?: any
}

export default function validateSubmit ({ wrapper, body, schema, setSchema, option }: Props) {
  
  // const handleSubmit= (e)=> {
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
              const fileDatas= createFileNames({data, id: [`id`], schema, key, method: 'add'});
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

    // console.log( check, datas, schema, wrapper )

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
    }
  return { check, data: datas, file: files }
      
  // }

  
  // return { handleSubmit, schema, setSchema }
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
    const uploadFullPath= `${uploadPath}/${name}`;
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