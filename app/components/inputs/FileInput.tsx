import { useEffect, useRef, useCallback, useState } from 'react';
import {_validate, errCheck, helpText} from './_validate';


import guidQ1 from '@/utils/validate/guid';
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'
// import Button from '../ui/Button';
import { IconCircleMinus, IconFile, IconTrashX } from '@tabler/icons-react';
import './FileInput.css'
// import Image from 'next/image';
import { SchemItemProps, SchemItemUpdateProps, ValidateMsgProps } from '@/@types/dataSchemas';
import path from 'path-browserify';
import { mimeTypeList } from '@/utils/data/files';
import _ from 'lodash';



const colorRange= {
  empty: '',
  true: 'secondary.main'
}

const msgRange:ValidateMsgProps= {
  empty: '',
  true: '',
  false: '유효하지 않음',
  null: '필수등록'
}
const validityRng= [true, 'empty', 'pass'];
const uploadPath= typeof window !== 'undefined' ? window.ENV.REMIX_PUBLIC_UPLOAD_PATH : process.env.REMIX_PUBLIC_UPLOAD_PATH;
type Method= 'create'|'update'

const previewWidth= 100;

const FileInput= ({ option, setSchema, schemas, method }:any)=> {
  
  const { key, name, value, defaultValue, required, validate, helperText, multiple, thumbWidth, notice }:SchemItemProps= option;
  const wholeSchema= schemas;
  const inputid= guidQ1()
  const operSetValue= useCallback(
    (callback, method: Method|null) => {
      console.log('set')
      setSchema( val => {
        const data= val[key];
        console.log(data)
        const dataValue= data.value;
        const resVal= callback(dataValue)
        const validate= _validate({schema: data, value: resVal, wholeSchema});
        const err= validate.valid.filter( vaild=> validityRng.indexOf(vaild.value) == -1 )
        
        let validates= validate.valid
        if( method == 'update') {
          validates[0]= { 
            ...validate.valid[0],
            value: 'pass', 
          }
        }
        if( method == 'create') {
          validates[0]= { 
            ...validate.valid[0],
            value: 'empty',
          }
        }
        

        if( err.length > 0 ) {
          return {
            ...val,
            [key]: {
              ...val[key],
              validate: validates
            }
          };
        }

        return {
          ...val,
          [key]: {
            ...val[key],
            validate: validates,
            value: validate.value,
          }
        }
      });
    },
    []
  );

  const removeFilesAll= (e)=> { operSetValue(()=> [], null)}
  const removeFile= (id)=> (e)=> { operSetValue((dataValue)=> dataValue.filter( v=> v.id != id ), null) }

  const handleValue= (e)=> {
    const targetFiles= e.target.files;
    const targetVal= Object.keys(targetFiles).map( idx=> {
      const file= targetFiles[idx];
      return {
        id: guidQ1(),
        blob: URL.createObjectURL(file),
        thumbnail: null,
        file,
      }
    })
    
    operSetValue((dataValue)=> {
      return Array.isArray(dataValue) ? dataValue.concat(targetVal) : targetVal
    }, null)
    e.target.value = null;
  }


  
  

  const previewRef:any = useRef([]);
  const cpBtn = useRef([]);
  useEffect(() => {
    previewRef.current.map((val, key)=> {
      previewRef[key] && captureThumbnail(key, null, null)(null);
    })
    
  }, [previewRef]);

  const captureThumbnail = (index, id, blob) => (e)=> {
    // const blobUrl= window.URL.createObjectURL(file);
    const video:any= previewRef.current[index];
    const videoWidth= video.videoWidth;
    const videoHeight= video.videoHeight;
    const ratio= videoWidth/videoHeight;

    const width= 400;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = width/ratio;
    const ctx:any= canvas.getContext("2d");

    setTimeout( e=> {
      ctx.drawImage( video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height );
      const thumbImg= canvas.toDataURL(`image/jpg`);
      const strThumbImg = thumbImg.replace(/^data:image\/[a-z]+;base64,/, "");

      operSetValue((dataValue)=> dataValue.map( value=> {
        if( value.id == id ) value.thumbnail= strThumbImg;
        return value;
      }), null )
    }, 500)
    
    
    /* fetch(canvas.toDataURL())
    .then((res) => res.blob())
    .then((blob) => {
      const NewFile = new File([blob], "video_thumbnail", {
        type: "image/jpg"
      });
      console.log(NewFile);
    }); */
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    operSetValue((value)=> {
      return arrayMoveImmutable(value, oldIndex, newIndex)
    }, null)
  }
  // console.log(value)
  const labelRef= useRef<HTMLLabelElement>(null)
  const help= helperText && validate && helpText({validate});
  const err= errCheck({validate});
  const [crud, setCrud]= useState<Method>(method || 'create')
  const onCreate= (e)=> {
    operSetValue((dataValue)=> [], 'create');
    setCrud('create')
  }
  const onUpdate= (e)=> {
    operSetValue((dataValue)=> defaultValue, 'update');
    setCrud('update')
  }
  // if( method == 'update' ) return <></>
  return (
    <>
    <div 
      className={`py-2 px-3 border ${err==true ? 'border-error' : 'border-base-content border-opacity-20'} rounded-btn bg-base-200`}
    >
      {
        method == 'update' && 
        <>
          {
            crud == 'update' &&
            <div className="my-1">
              <div 
                onClick={onCreate}
                className='btn btn-sm btn-success'
              >수정</div>
              
            </div>
          }

          {
            crud == 'create' &&
            <div className="my-1">
              <div 
                onClick={onUpdate}
                className='btn btn-sm btn-error'
              >취소</div>
            </div>
          }
        </>
      }
      
      
      <div className={`${err==true ? 'text-error' : 'text-input-text'} text-sm`} id={key}>
        {name}
        <span className="text-error">{required ? ' *' : ''}</span>
      </div>
      { 
        notice && 
        <div 
          className='text-error'
        >
          *{notice}
        </div>
      }
      {
        crud == 'update' &&
        <div className="mt-1">
          <div className="list flex flex-wrap gap-1 w-full" >
            
            { 
              value && Array.isArray(value) && value?.length > 0 && value.map((val, key)=> {
                const width= thumbWidth || previewWidth;
                const src=`${uploadPath}${val}`;
                const filename= path.basename(src)
                const ext= path.extname(src).split('.').pop().toLowerCase()
                const fileType = mimeTypeList[ext] ? mimeTypeList[ext].split('/')[0] : '';
                // const fileType= filename?.split('/')[0];
                // console.log(src, filename, ext)
                return (
                  <FileInputListItemWrap key={key} width={width}>
                    <div className="mt-2">
                      <FileInputListItem name={filename} >
                        {
                          fileType == 'image' &&
                          <div className='flex flex-col justify-end'>
                            <img
                              src={src} 
                              width={width}
                              height={width}
                              alt="File Input Image"
                              style={{
                                objectFit: 'contain',
                              }}
                              draggable={false}
                            />
                            {/* <img 
                              src={`${uploadPath}${val}`} 
                              style={{width: width}}
                              draggable={false}
                            /> */}
                          </div>
                        }
                        {
                          fileType != 'image' && fileType != 'video' &&
                          <div className="w-full flex flex-col justify-center">
                            <div className='block text-center'>
                              <IconFile 
                                ref={el => previewRef.current[key] = el}
                                size='28px' 
                                className='font-thin text-main inline-block'
                              />
                            </div>
                          </div>
                        }
                      </FileInputListItem>
                    </div>
                  </FileInputListItemWrap>
                )
              })
            }
          </div>
        </div>
      }
      {
        crud== 'create' &&
        <div className='mt-1'>
          <div className="flex items-center">
            <label ref={labelRef} htmlFor={`contained-button-file-${key}-${inputid}`}>
              <input 
                // accept="image/*" 
                type="file" 
                multiple={multiple} 
                id={`contained-button-file-${key}-${inputid}`} 
                onChange={handleValue}
                className='hidden'
              />
              <div 
                className='btn btn-sm btn-accent'
                onClick={e=>{
                  e.stopPropagation()
                  e.preventDefault()
                  labelRef && labelRef?.current?.click()
                }}
              >
                Upload
              </div>
            </label>
            <div className='btn btn-circle btn-xs btn-ghost ml-2' onClick={removeFilesAll}>
              <IconTrashX size={'18px'} className='text-error' />
            </div>
          </div>

          
          {
            value && value.length > 0 && 
            <div className="py-2">
              <div className=''>
                
                <SortableList 
                  onSortEnd={onSortEnd} 
                  className="list flex flex-wrap gap-1 w-full" 
                  draggedItemClassName="file-inputs-dragged"
                >
                {value?.length && value.map((val, key)=> {
                  console.log(value)
                  const { id, file, blob, thumbnail }= val;
                  // console.log(val, file)
                  const fileType= file?.type?.split('/')[0];
                  const width= thumbWidth || previewWidth;
                  return (
                    <SortableItem key={key} >
                      <div key={key} className="">
                        <FileInputListItemWrap width={width}>
                          <div className="">
                            <div className='btn btn-circle btn-xs btn-ghost' onClick={removeFile(id)}>
                              <IconCircleMinus size={'14px'} className='text-error' />
                            </div>
                          </div>
                          <FileInputListItem name={file.name} >
                            <>
                              {/* {
                                fileType == 'video' &&
                                <div className='flex-col justify-end'>
                                  <video 
                                    ref={el => previewRef.current[key] = el }
                                    key={blob} 
                                    controls 
                                    style={{width: '100%'}}
                                    onLoadedMetadata={captureThumbnail(key, id, null)}
                                  >
                                    <source src={blob}/>
                                  </video>
                                </div>
                              } */}
                              {
                                fileType == 'image' &&
                                <div className='flex flex-col justify-end'>
                                  <img
                                    src={URL.createObjectURL(file)} 
                                    width={width}
                                    height={width}
                                    alt="File Input Image"
                                    style={{
                                      objectFit: 'contain',
                                    }}
                                    draggable={false}
                                  />
                                  {/* <img 
                                    ref={el => previewRef.current[key] = el }
                                    // type={file.type} 
                                    src={URL.createObjectURL(file)} 
                                    style={{width: '100%'}}
                                    draggable={false}
                                    
                                  /> */}
                                </div>
                              }
                              {
                                fileType != 'image' && fileType != 'video' &&
                                <div className="w-full flex flex-col justify-center">
                                  <div className='block text-center'>
                                    <IconFile 
                                      ref={el => previewRef.current[key] = el}
                                      size='28px' 
                                      className='font-thin text-main inline-block'
                                    />
                                  </div>
                                </div>
                              }
                            </>
                          </FileInputListItem>
                        </FileInputListItemWrap>
                        
                      </div>
                    </SortableItem>
                  )
                })}
                </SortableList>
                
              </div>
            </div>
          }
          
        </div>
      }
      
    </div>
    {help && <div className="mt-1 text-xs">{help}</div> }
    </>
  )
}
export const FileInputListItemWrap= ({width, children})=> {
  return (
    <div 
      className='border border-input flex flex-col cursor-grab' 
      style={{ width: width}}
    >{children}</div>
  )
}
export const FileInputListItem= ({ children, name })=> {
  return (
    <div className="px-1 pb-1 flex-1 flex flex-col">
      <div title={name} className=''>
        <span 
          className='text-2xs line-clamp-2 text-ellipsis break-all leading-[1.2]'
        >{name}</span>
      </div>
      
      <div className='py-1.5 flex-1 flex relative'>
        {children}
      </div>
    </div>
    
  )
}


export default FileInput;