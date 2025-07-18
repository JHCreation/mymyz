import queryFiles from "@/api/_files/queryOption";
import useValidate from "@/api/hooks/useValidate";
import { Inputs } from "@/components/inputs/Inputs";
import { Loading } from "@/components/ui/Loading";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { useTokenAuthRecall } from "@/api/user/hooks/useLogin";
import { ToastContainer, toast, cssTransition, Id, ToastOptions } from 'react-toastify';
import { toasterConfirm, toaster } from "@/components/ui/Toast";
import _ from 'lodash';
import { isEmptyArray } from "@/utils/validate/utility";
import { DataListContext } from "../GridDataType";
import Dialog from "~/components/ui/Dialog";
import { CloseIcon } from "../comps";
import { authorization } from "~/api/auth/useAuth";
import { useNavigate } from "@remix-run/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Create_1_Input from "../Create";


const toastContainerId= 'categoryCreateToast';
const toastCreateId= 'categoryCreate';
const toastFileCreateId= 'categoryFileCreate';
const toastOpt:ToastOptions= {
  containerId: toastContainerId,
  autoClose: 3000
}

export default function Create_1<T extends FieldValues> (props) {
  
  
  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, defaultFilters, category, page, setPage, pageSize, log, setLog, queryOptions, reload}= context;

  const { open, setOpen, keyname, useSchemas }= props;

  const {schema, getDefaultSchema, setSchema, init}= useSchemas({
    keyname: queryOptions.name, 
  });

  const { queryFn: mutationFilesFn }= queryFiles.upload();
  const mutationFiles = useMutation({
    mutationFn: mutationFilesFn
  })
  
  const { queryFn: mutationFn }= queryOptions.create();
  const mutationCreate = useMutation({
    mutationFn
  }) as any

  const wrapper= useRef<HTMLDivElement>(null);
  const body= useRef<HTMLDivElement>(null);
  const { handleValidate }= useValidate({
    wrapper,
    body,
    schema,
    setSchema,
  });
  
  const [status, setStatus]= useState<'edit'|'pending'|'confirm'>('edit')
  const submit= (log)=> {
    const { check, data, file }= handleValidate();
    /* const { check, data, file }= validateSubmit({
      body,
      schema,
      setSchema,
    }) */
    console.log(data, file)
    if( !check ) return;
    handleCreate({ log, data, file })
    /* mutation.mutate({ data, access_token: log?.access_token })
    Object.keys(file).map( key=> {
      mutationFiles.mutate({
        key,
        fileDatas: file[key]
      })
    }) */
  }

  const fileCreate= ({log, file})=> {
    toaster.loading({text: "파일을 처리중입니다..."}, { ...toastOpt, toastId: toastFileCreateId })
    Object.keys(file).map( key=> {
      mutationFiles.mutate({
        key,
        fileDatas: file[key],
        access_token: log?.access_token
      })
    })
  }

  const handleCreate= ({ log, data, file })=> {
    setStatus('pending')
    console.log('file',file,!_.isEmpty(file), !file)
    return
    if( !_.isEmpty(file) && file ) fileCreate({log, file})
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

  const navigate= useNavigate()
  const handleSubmits= async (log)=> {
    authorization({ 
      log, 
      setLog,
      valid: (log)=> submit(log),
      invalid: (log)=> {
        toaster.error({text: '사용자 인증이 되지 않았습니다. 다시 로그인 해주세요.'}, { ...toastOpt, toastId: toastCreateId })
        navigate('/login')
      }
    })
  }

  useEffect(()=> {
    if( mutationCreate.data ) {
      if( mutationCreate.data?.status != 'success' ) {
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastCreateId, 
            { text: JSON.stringify(mutationCreate.data) },
            { 
              ...toastOpt, 
              type: "error", 
              isLoading: false, 
              autoClose: 2000, 
              hideProgressBar: true ,
              onClose: ()=> setStatus('edit')
            }
          )
        // }, 1000)
        return;
      }
      if( mutationCreate.data?.status == 'success' ) {
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastCreateId, 
            { text: '성공입니다.' },
            { 
              ...toastOpt, 
              type: "success", 
              isLoading: false, 
              autoClose: 2000, 
              hideProgressBar: true ,
              onClose: ()=> setStatus('edit')
            }
          )
        // }, 1000)
        init();
        reload({filters, page, pageSize})
        return;
      }
    }
    
  }, [mutationCreate.data])



  useEffect(()=> {
    console.log(mutationFiles.data, 
      // _.flattenDeep(mutationFiles.data)
    )
    if( mutationFiles.data ) {
      const res= _.flattenDeep(mutationFiles.data);
      const err= res.filter( res=> {
        return res.response.status != 200
      })

      if( isEmptyArray(err) ) {
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastFileCreateId, 
            { text: '파일 처리 성공입니다.' },
            { 
              ...toastOpt, 
              type: "success", 
              isLoading: false, 
              autoClose: 2000, 
              hideProgressBar: true ,
              onClose: ()=> setStatus('edit')
            }
          )
        // }, 1000)
        init();
        return;
      }


      if( !isEmptyArray(err) ) {
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastFileCreateId, 
            { text: `${JSON.stringify(mutationFiles.data)} Files!!!` },
            { 
              ...toastOpt, 
              type: "error", 
              isLoading: false, 
              autoClose: 2000, 
              hideProgressBar: true ,
              onClose: ()=> setStatus('edit')
            }
          )
        // }, 1000)
        return;
      }
      
    }
    
  }, [mutationFiles.data])

  const handleClose= ()=> {
    setOpen(false)
  }
  return (
    <Dialog open={open} setOpen={setOpen} outsidePress={true} escapeKey={false} contentClassName="p-0">
    
    <div className="">
    <Create_1_Input />

    
    {/* <dialog id="modal_create" className={`modal`} open={open} > */}
    {/* <div className="modal" role="dialog"> */}
      {/* <div className={`modal-box`} ref={wrapper}> */}
      <div className={`modal-box- overflow-y-auto overscroll-contain duration-300 min-w-[400px] w-full max-w-[900px] scale-100 max-h-full my-auto bg-base-100 p-5 pb-0 `} ref={wrapper}>

          <CloseIcon handleClose={handleClose} />
          {
            // open &&
            <>
            {mutationCreate.isPending ? (
              <div className="max-h-dvh-nav min-h-80 flex items-center justify-center">
                <Loading/>
              </div>
            ) : (
              <>
              <div className="mt-10">
                <div className="text-sm">{keyname}</div>
              </div>
              <div ref={body} className="w-full">
                <Inputs schema={schema} setSchema={setSchema} keyname={keyname} toastOption={toastOpt} />
              </div>

              <div className="w-full sticky bottom-0 bg-base-100 py-4">
                {
                  status == 'edit' &&
                  <div className="btn btn-sm btn-accent w-full" onClick={e=>handleSubmits(log)}>등록</div>
                }
              </div>
              
              </>
            )}
            </>
          }
        </div>
      {/* </div> */}

      {/* <div className="modal-backdrop bg-black bg-opacity-50 duration-1000 " >
      </div> */}

      
      <div className="fixed bottom-0">
        <ToastContainer
          containerId={toastContainerId}
          // stacked
          position="bottom-center"
          // limit={1}
          className={""}
          // transition={bounce}
        />
      </div>
    {/* </div> */}
    {/* </dialog> */}
    </div>


    
    </Dialog>
  )
}