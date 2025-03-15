import { SchemItemProps } from '@/@types/dataSchemas';
import { _validate, errCheck, helpText } from './_validate';


import React, { useEffect, useState } from 'react';
import { useHydrated } from 'remix-utils/use-hydrated';
import { ClientOnly } from "remix-utils/client-only";
import ClientSideQuillEditor from './.client/ClientSideQuillEditor';
// import ClientSideQuillEditor from './QuillEditor.client';
/* const ClientSideQuillEditor = React.lazy(() => 
  import('./ClientSideQuillEditor.client')
  .catch(err => {
    console.error('Error loading Quill Editor:', err);
    return { default: () => <div>Error loading editor</div> };
  })
); */

export default function EditorInput ({ option, setSchema, ...props }:any) {
  const { key, name, value, required, validate, helperText, maxLen, disabled, placeholder, notice }:SchemItemProps= option;
  const { name: tableName, schemas: wholeSchema, toastOption }= props;
  const isHydrated = useHydrated();
  /* const [ClientSideQuillEditor, setReactQuill] = useState<any>(null);
  useEffect(() => {
    if (isHydrated) {
      // 클라이언트 사이드에서만 React Quill을 import
      import('./ClientSideQuillEditor').then((module) => {
        setReactQuill(() => module.default);
      });
    }
  }, []);

  if (!ClientSideQuillEditor) {
    // React Quill이 로드되기 전 보여줄 내용
    return <div>Loading editor...</div>;
  } */
  

  const handleValue= (keyname, value)=> {
    let targetValue= value;

    /* if( isNum ) {
      if( numComma ) targetValue= numCheck.checkNum(e.target.value);
      else targetValue= numCheck.checkNumStr(e.target.value);
    } */

    // const value= obj || { value: targetValue };
    if( maxLen !== undefined && ( maxLen && String(targetValue).length > maxLen ) ) return;
  
    setSchema((val:any)=> {
      const data= val[key];
      const validate= _validate({schema: data, value: targetValue, wholeSchema})
      return {
        ...val,
        [keyname]: {
          ...val[keyname],
          // ...value,
          value: validate.value,
          validate: validate.valid,
        }
      }
    });
      
  }
  
  const help= helperText && validate && helpText({validate});
  const err= errCheck({validate});

  // const { quill, quillRef } = useQuill();
  /* const [isClient, setIsClient]= useState(false)
  useEffect(()=> {
    setIsClient(true)
  }, []) */
  return (
    <>
    <div className='max-w-[600px] flex flex-col bg-base-300 border border-base-content border-opacity-20 p-2 rounded-btn'>
      {/* <span className='text-xs'>{name}</span> */}
      <div className={`${err==true ? 'text-error' : ''} text-xs`}>
        {name}
        <span className="text-error">{required ? ' *' : ''}</span>
      </div>
      {/* <ClientOnly fallback={<div>loading..........</div>} >
        {() => <ClientSideQuillEditor id={wholeSchema.id.value} tableName={tableName} keyName={key} value={value} option={option} handleValue={handleValue} err={err} />}
      </ClientOnly> */}

      {
        // isClient &&
        // <ClientSideQuillEditor option={option} handleValue={handleValue} err={err} />

      }
      {/* <ClientSideQuillEditor id={wholeSchema.id.value} tableName={tableName} keyName={key} value={value} option={option} handleValue={handleValue} err={err} /> */}

      {
        isHydrated ? (
          <React.Suspense fallback={<div>Loading editor...</div>}>
            <ClientSideQuillEditor id={wholeSchema.id.value} tableName={tableName} keyName={key} value={value} option={option} handleValue={handleValue} err={err} toastOption={toastOption}/>
          </React.Suspense>
        ) : (
          <div>Editor is loading...</div>
        )
      }
      {/* <input
        type="text"
        disabled={disabled}
        required={required || false}
        id={key}
        name={key}
        value={value}
        onChange={handleValue(key, null)}
        placeholder={placeholder || undefined}
        className={`input input-sm input-bordered ${err==true ? 'border-error' : 'border-base-content border-opacity-20'} w-full mt-1`}
      /> */}
      {help && <div className="mt-1">{help}</div> }
      {notice}
    </div>
    </>
  )
}