import { SchemItemProps } from "@/@types/dataSchemas";
import queryFiles from "@/api/_files/queryOption";
import queryOptions from "@/api/category/queryOption";
import useValidate from "@/api/hooks/useValidate";
import { Inputs } from "@/components/inputs/Inputs";
// import Button from "@/components/ui/Button";
// import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import _, { divide } from 'lodash';
import { tokenAuthorization, useTokenAuthRecall } from "@/api/user/hooks/useLogin";
// import { useRecoilValue } from "recoil";
// import { logState } from "@/recoil/atoms/log";
import { ToastContainer, toast, cssTransition, Id, ToastOptions } from 'react-toastify';
import { toasterConfirm, toaster } from "@/components/ui/Toast";
// import { useRouter } from "next/navigation";
import { isEmptyArray } from "@/utils/validate/utility";
import { useNavigate } from "@remix-run/react";
// import { Modal } from '@mui/base/Modal';
import clsx from 'clsx';
import { useLogState } from "~/store/store";
import { IconX } from "@tabler/icons-react";
import { CommCreate } from "~/@types/queryType";
import { DataListContext } from "./GridDataType";
import Dialog from "~/components/ui/Dialog";
import { CloseIcon } from "./comps";

const toastContainerId= 'categoryUpdateToast';
const toastUpdateId= 'categoryUpdate';
const toastFileUpdateId= 'categoryFileUpdate';
const toastOpt:ToastOptions= {
  containerId: toastContainerId,
  autoClose: 3000
}
export default function Update (props) {

  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, defaultFilters, useSchemas, category, page, setPage, pageSize, log, reload, queryOptions}= context;

  // const { log, setLog }= useLogState()
  // const log= useRecoilValue(logState);

  const { open, setOpen, keyname, data }= props;
  const {schema, setSchema, getDefaultSchema, init}= useSchemas({
    keyname: queryOptions.name, 
    option: { data }
  });
  // const navigate= useNavigate()

  useEffect(()=> {
    if( open ) {
      setStatus('edit')
      toaster.dismiss()
    }
  },[open])

  useEffect(()=> {
    if( data ) {
      // const schm= getDefaultSchema({ keyname: queryOptions.name })
      const schm= _.cloneDeep(schema)
      Object.keys(schm).map((key)=> {
        const item: SchemItemProps= schm[key]

        let value;
        try { value= JSON.parse(data[key]); } 
        catch { value = data[key]; }
        
        const validates= schm[key].validate.map(validate=> {
          return {
            ...validate, 
            value: 'pass'
          }
        })

        schm[key]= _.extend(schm[key], {
          value: value, 
          validate: validates,
          defaultValue: value,
          ...item?.update
        })
        
      })
      setSchema(schm)
      
    }
  }, [data])


  const { queryFn: mutationFilesFn }= queryFiles.update();
  const mutationFiles = useMutation({
    mutationFn: mutationFilesFn,
    // gcTime: 0
  })

  const { queryFn: mutationFn }= queryOptions.update(data.id);
  const mutationData = useMutation<any, any, any>({
    mutationFn
  })

  const wrapper= useRef<HTMLDivElement>(null);
  const body= useRef<HTMLDivElement>(null);
  const { handleValidate }= useValidate({
    wrapper,
    body,
    schema,
    setSchema,
    method: "update",
  });

  

  const [status, setStatus]= useState<'edit'|'pending'|'confirm'>('edit')
  const submit= (log)=> {
    
    const { check, data, file, schema, status }= handleValidate();
    console.log(check, data, schema)
    if( !check ) {
      toaster.error({text: status}, { ...toastOpt, toastId: toastUpdateId, onClose: (d)=> setStatus('edit')
    })
      return;
    }
    // console.log(file, !_.isEmpty(file))

    // 기존파일이 지워질때
    if( !_.isEmpty(file) ) {
      const delkey= Object.keys(file).filter( key=> {
        return file[key]?.file?.length == 0
      });

      if( delkey?.length > 0 ) {
        setStatus('pending')
        toasterConfirm({
          text: '파일이 삭제됩니다. 진행하시겠습니까?',
          agree: (e)=> {
            toaster.update(toastFileUpdateId, 
              { text:  "파일을 처리중입니다..." },
              { 
                ...toastOpt,
                type: "loading", 
                isLoading: true, 
                autoClose: 3000, 
                hideProgressBar: true ,
              }
            )
            handleUpdate({ log, data, file }, true)
          },
          disagree: (e)=> {
            toast.dismiss(toastFileUpdateId)
            setStatus('edit')
          },
        }, { ...toastOpt, toastId: toastFileUpdateId, onClose: ()=> setStatus('edit')})
        return;
      }
    }
    handleUpdate({ log, data, file }, false)
  }

  const fileUpdate= ({log, file, noLoading})=> {
    if( !noLoading && !_.isEmpty(file) ) toaster.loading({text: "파일을 처리중입니다..."}, { ...toastOpt, toastId: toastFileUpdateId })
    Object.keys(file).map( key=> {
      mutationFiles.mutate({
        key,
        fileDatas: file[key],
        access_token: log?.access_token
      })
    })
  }

  const handleUpdate= ({ log, data, file }, noLoading)=> {
    setStatus('pending')
    toaster.loading({text: "처리중입니다..."}, { ...toastOpt, toastId: toastUpdateId })
    mutationData.mutate({ data, access_token: log?.access_token })
    fileUpdate({log, file, noLoading})
  }
  
  const {handleAuthRefresh}= useTokenAuthRecall({ 
    submit : (log)=> submit(log),
    expiredCallback: (auth)=> {
      /* toaster.warn({text: '재시도'}, { 
        // toastId: toastUpdateId 
      }) */
    },
    unauthorizedCallback: (auth)=> {
      toaster.error({text: '사용자 인증이 되지 않았습니다.'}, { ...toastOpt, toastId: toastUpdateId })
    } 
  });
  const handleSubmit= (e)=> {
    handleAuthRefresh(log);
    // submit(log);
  }

  useEffect(()=> {
    console.log(mutationData.data, mutationFiles.data, _.flattenDeep(mutationFiles.data))
    if( mutationData.data ) {
      if( mutationData.data?.status != 'success' ) {
        
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastUpdateId, 
            { text: JSON.stringify(mutationData.data) },
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
      if( mutationData.data?.status == 'success' ) {
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastUpdateId, 
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
        // init()
        reload({filters, page, pageSize})
        return;
      }
    }
    
  }, [mutationData.data])


  useEffect(()=> {
    
    if( mutationFiles.data ) {

      const res= _.flattenDeep(mutationFiles.data);
      const err= res.filter( res=> {
        return res.response.status != 200
      })
      // console.log(res, err)

      if( isEmptyArray(err) ) {
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastFileUpdateId, 
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
        // init();
        return;
      }
      
      if( !isEmptyArray(err) ) {
        
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastFileUpdateId, 
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
  // console.log(data)
  return (
    <>
    <Dialog open={open} setOpen={setOpen} outsidePress={true} escapeKey={false}>
    {/* <dialog id="modal_update" className={`modal`} open={open}> */}
      {/* <div className={`modal-box w-dvw max-w-[512px] max-h-dvh`} ref={wrapper}> */}
      <div className={`modal-box scale-100 max-h-full my-auto bg-base-100 p-5 pb-0`} ref={wrapper}>

        <div className="">
          <CloseIcon handleClose={handleClose} />
          

            {
              <div className="relative w-full h-full mt-10">
                <div ref={wrapper} className="">
                  <div ref={body} className="w-full">
                    <Inputs schema={schema} setSchema={setSchema} keyname={keyname} method="update" />
                  </div>
                </div>
                  
                <div className="w-full sticky bottom-0 bg-base-100 py-4">
                  {
                    status == 'edit' &&
                    <div className="btn btn-sm btn-accent w-full" onClick={handleSubmit}>등록</div>
                  }
                </div>
                
              </div>
            }

        </div>
      </div>

      {/* <div className="modal-backdrop bg-black bg-opacity-50 duration-1000 " onClick=  {handleClose}>
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
      
    {/* </dialog> */}
    </Dialog>
    </>
  )
}