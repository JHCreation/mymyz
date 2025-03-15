
import { useEffect, useRef, useState } from "react";

import { Rising2, RisingText } from "../main/RisingText";
import queryOptions from "~/api/contact/queryOption";
import { useMutation } from "@tanstack/react-query";
import useValidate from "~/api/hooks/useValidate";
import { toaster } from "~/components/ui/Toast";
import { ToastContainer, ToastOptions } from "react-toastify";
import { useTokenAuthRecall } from "~/api/user/hooks/useLogin";
import useSchemas from "~/api/contact/useSchemas";
import { useLogState } from "~/store/store";
import { Input } from "~/components/inputs/Inputs";
import { SchemItemProps } from "~/@types/dataSchemas";
import { useTextInput } from "~/components/inputs/TextInput";
import { helpText } from "~/components/inputs/_validate";

const toastContainerId= 'publicContactCreateToast';
const toastCreateId= 'publicContactCreate';
// const toastFileCreateId= 'publicContactFileCreate';
const toastOpt:ToastOptions= {
  containerId: toastContainerId,
  autoClose: 3000
}

export default function ContactInputs () {
  /* const { queryFn: mutationFilesFn }= queryFiles.upload();
  const mutationFiles = useMutation({
    mutationFn: mutationFilesFn
  }) */
  const { log }= useLogState();
  const { queryFn: mutationFn }= queryOptions.create();
  const mutationCreate = useMutation({
    mutationFn
  }) as any
  const {schema, getDefaultSchema, setSchema, init}:any= useSchemas({
    keyname: queryOptions.name, 
  });

  const wrapper= useRef<HTMLDivElement>(null);
  const body= useRef<HTMLDivElement>(null);
  const { handleValidate }= useValidate({
    // wrapper,
    // body,
    schema,
    setSchema,
  });


  
  const [status, setStatus]= useState<'edit'|'pending'|'confirm'>('edit')
  const submit= (e)=> {
    /* toaster.success({text: '접수가 등록 되었습니다!'}, { 
      ...toastOpt, toastId: toastCreateId,
      autoClose: false
      // hideProgressBar: true
    })
    return; */
    
    const { check, data, file }= handleValidate();
    console.log(check, data)
    if( !check ) return;
    handleCreate({ log, data, file })
  }

  /* const fileCreate= ({log, file})=> {
    toaster.loading({text: "파일을 처리중입니다..."}, { ...toastOpt, toastId: toastFileCreateId })
    Object.keys(file).map( key=> {
      mutationFiles.mutate({
        key,
        fileDatas: file[key],
        access_token: log?.access_token
      })
    })
  } */

  const handleCreate= ({ log, data, file })=> {
    setStatus('pending')
    // console.log('file',file,!_.isEmpty(file), !file)
    // if( !_.isEmpty(file) && file ) fileCreate({log, file})
    toaster.loading({text: "처리중입니다..."}, { ...toastOpt, toastId: toastCreateId })
    mutationCreate.mutate({ data, access_token: log?.access_token })
  }

  /* const {handleAuthRefresh}= useTokenAuthRecall({ 
    submit : (log)=> submit(log),
    expiredCallback: (auth)=> {
      toaster.warn({text: '재시도'}, { 
        ...toastOpt, 
        // toastId: toastCreateId 
      })
    },
    unauthorizedCallback: (auth)=> {
      console.log(auth)
      toaster.error({text: '사용자 인증이 되지 않았습니다.'}, { ...toastOpt, toastId: toastCreateId })
    }  
  });
  const handleSubmit= (e)=> {
    handleAuthRefresh(log);
  } */

  // const [status, setStatus]= useState<StatusType>({ open: false, color: 'teal', msg: ''})
  const [response, setResponse]= useState<string>('')
  useEffect(()=> {
    if( mutationCreate.data ) {
      if( mutationCreate.data?.status != 'success' ) {
        // setResponse(JSON.stringify(mutationCreate.data))
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.error({text: JSON.stringify(mutationCreate.data)}, { 
            ...toastOpt, toastId: toastCreateId,
            autoClose: false
          })
          /* toaster.update(toastCreateId, 
            { text: JSON.stringify(mutationCreate.data) },
            { 
              ...toastOpt, 
              type: "error", 
              isLoading: false, 
              autoClose: 2000, 
              hideProgressBar: true ,
              onClose: ()=> setStatus('edit')
            }
          ) */
        // }, 1000)
        return;
      }
      if( mutationCreate.data?.status == 'success' ) {
        // setTimeout(e=> {
          setStatus('confirm')
          /* toaster.success({text: '접수가 등록 되었습니다!'}, { 
            ...toastOpt, toastId: toastCreateId,
            autoClose: false
          }) */
          toaster.update(toastCreateId, 
            { text: '접수가 등록 되었습니다!' },
            { 
              ...toastOpt, 
              type: "success", 
              isLoading: false, 
              // autoClose: 2000, 
              hideProgressBar: true ,
              onClose: ()=> setStatus('edit')
            }
          )
        // }, 1000)
        init();
        // reload({filters, page, pageSize})
        return;
      }
    }
    
  }, [mutationCreate.data])


  return (
    <div className="bg-paper relative z-20">
      {
      schema &&
      <div className="w-full p-6">
        
        <ContactText text={'안녕하세요,'} />
        <div className="md:flex items-end py-3 md:py-4">
          <ContactText text={'저희 업체명은'} />
          {/* <ContactInput schemaKey={'name'} schema={schema} setSchema={setSchema} keyname={queryOptions.name} toastOption={toastOpt} placeholder={"업체명을 입력해 주세요."} /> */}
          <Inputs schemaKey={'name'} schema={schema} setSchema={setSchema} keyname={queryOptions.name} toastOption={toastOpt} placeholder={"업체명을 입력해 주세요."} />
        </div>
        
        <div className="md:flex items-end py-3 md:py-4">
          <ContactText text={'저희의 이메일 주소는'} />
          {/* <ContactInput placeholder={"이메일 주소를 입력해 주세요."}/> */}
          <Inputs schemaKey={'email'} schema={schema} setSchema={setSchema} keyname={queryOptions.name} toastOption={toastOpt} placeholder={"이메일 주소를 입력해 주세요."} />
        </div>
        <div className="md:flex items-end py-3 md:py-4">
          <ContactText text={'연락처는'} />
          <Inputs schemaKey={'phone'} schema={schema} setSchema={setSchema} keyname={queryOptions.name} toastOption={toastOpt} placeholder={"연락처를 입력해 주세요."}/>
          
          {/* <ContactInput placeholder={"연락처를 입력해 주세요."}/> */}
        </div>
        <div className="md:flex items-end py-3 md:py-4">
          <ContactText text={'상담내용은'} />
          <TextInputs schemaKey={'content'} schema={schema} setSchema={setSchema} keyname={queryOptions.name} toastOption={toastOpt} placeholder={"내용을 입력해 주세요."}/>
          
          {/* <ContactInput placeholder={"연락처를 입력해 주세요."}/> */}
        </div>
        <div className="mt-4 md:mt-10">
          <div className="inline-block ml-[50%] md:ml-[35%] -translate-x-1/2">
            <div 
              onClick={submit}
              className="btn btn-accent btn-circle w-20 h-20 md:w-48 md:h-48 hover:scale-90 custom-hover-xl text-md md:text-2xl transition duration-150"
            >요청
            </div>
          </div>
        </div>
      </div>
      }

      <div className="fixed bottom-0">
        <ToastContainer
          containerId={toastContainerId}
          theme="dark"
          // stacked
          position="bottom-center"
          // limit={1}
          // className={"!w-full max-w-[500px] "}
          // toastClassName={"!p-5"}
          // bodyClassName={"!p-2 justify-center"}
          
          // transition={bounce}
        />
      </div>
    </div>
  )
}





const errorColor= 'text-red-400'
function Inputs ({schemaKey, schema, setSchema, keyname, toastOption, placeholder}) {

  const { key, name, value, required, validate, helperText, maxLen, disabled, notice }:SchemItemProps= schema[schemaKey];
  // const { schemas: wholeSchema }= props;
  const { err, handleValue, help }= useTextInput({ option: schema[schemaKey], setSchema })
  const helper= helperText && validate && helpText({
    validate, colors: { 
      null: errorColor, 
      false: errorColor
    }
  });
  
  return (
    <div className="w-full md:ml-5 md:mt-0 mt-2">
      {helper && <div className="mb-1 text-xs md:text-sm animate-[bounce_1s_ease-in-out_infinite]">{helper}</div> }
      
      <input 
        type="text" placeholder={placeholder} 
        className={`${err ? 'placeholder:text-red-400 border-red-400' : 'border-black'} w-full input input-sm md:input-lg px-1 md:px-2 py-2 md:py-4 text-md border-0 focus:outline-none rounded-none border-b  text-center `} 
        disabled={disabled}
        // error={err}
        required={required || false}
        // color='teal'
        id={key}
        // label={name}
        name={key}
        value={value}
        onChange={handleValue(key, null)}  
      />
    </div>
  )
}


function TextInputs ({schemaKey, schema, setSchema, keyname, toastOption, placeholder}) {

  const { key, name, value, required, validate, helperText, maxLen, disabled, notice }:SchemItemProps= schema[schemaKey];
  // const { schemas: wholeSchema }= props;
  const { err, handleValue, help }= useTextInput({ option: schema[schemaKey], setSchema })
  const helper= helperText && validate && helpText({
    validate, colors: { 
      null: errorColor, 
      false: errorColor
    }
  });
  
  return (
    <div className="w-full md:ml-5 md:mt-0 mt-2">
      {helper && <div className="mb-1 text-xs md:text-sm animate-[bounce_1s_ease-in-out_infinite]">{helper}</div> }
      
      <textarea 
        // type="text" 
        // rows={5}
        placeholder={placeholder} 
        className={`${err ? 'placeholder:text-red-400 border-red-400' : 'border-black'} w-full textarea textarea-sm md:textarea-lg px-1 md:px-2 py-2 md:py-3 text-md border-0 focus:outline-none rounded-none border-b  text-center leading-3`} 
        disabled={disabled}
        // error={err}
        required={required || false}
        // color='teal'
        id={key}
        // label={name}
        name={key}
        value={value}
        onChange={handleValue(key, null)}  
      />
    </div>
  )
}

function ContactInput ({ option, setSchema, placeholder, ...props }:any) {
  
  const { key, name, value, required, validate, helperText, maxLen, disabled, notice }:SchemItemProps= option;
  const { schemas: wholeSchema }= props;
  const { err, handleValue, help }= useTextInput({ option, setSchema, ...props })
  console.log(err, key)
  return (
    <input type="text" placeholder={placeholder} className={`w-full input input-sm md:input-lg px-1 md:px-2 py-2 md:py-4 md:ml-5 md:mt-0 mt-2 text-md border-0 focus:outline-none rounded-none border-b border-black text-center `} />
  )
  
  return (
    <div className='flex flex-col bg-base-300 border border-base-content border-opacity-20 p-2 rounded-btn'>
      {/* <span className='text-xs'>{name}</span> */}
      <div className={`${err==true ? 'text-error' : ''} text-xs`}>
        {name}
        <span className="text-error">{required ? ' *' : ''}</span>
      </div>
      <input
        // {...props}
        type="text"
        disabled={disabled}
        // error={err}
        required={required || false}
        // color='teal'
        id={key}
        // label={name}
        name={key}
        value={value}
        onChange={handleValue(key, null)}
        placeholder={placeholder || undefined}
        /* labelProps={{
          className: "peer-disabled:!text-black"
        }} */
        className={`input input-sm input-bordered ${err==true ? 'border-error' : 'border-base-content border-opacity-20'} w-full mt-1`}
      />
      {help && <div className="mt-1">{help}</div> }
      {notice}
    </div>
  )
}

const ContactText= ({ text })=> {
  return (
    <div className="text-left text-2xl md:text-title font-bold ">
      <RisingText 
        text={text}
        className="leading-6 md:leading-none text-nowrap"
      />
    </div>
  )
}

/* const ContactInput= ({ placeholder })=> {
  return (
    <input type="text" placeholder={placeholder} className="w-full input input-sm md:input-lg px-1 md:px-2 py-2 md:py-4 md:ml-5 md:mt-0 mt-2 text-md border-0 focus:outline-none rounded-none border-b border-black text-center " />
  )
} */