import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import queryFiles from "@/api/_files/queryOption";
import { toaster, toasterConfirm } from "~/components/ui/Toast";
import { useTokenAuthRecall } from "~/api/user/hooks/useLogin";
import { isEmptyArray } from "~/utils/validate/utility";
import _ from "lodash";
import { DataListContext } from "./GridDataType";

const toastContainerId= 'categoryDeleteToast';
const toastDeleteId= 'categoryDelete';
const toastFileDeleteId= 'categoryFileDelete';
const toastOpt:ToastOptions= {
  containerId: toastContainerId,
  autoClose: 3000
}
export default function Delete ({ checked, deleteOn, setDeleteOn, keyname, schema, setSchema }) {
  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, defaultFilters, category, page, setPage, pageSize, log, queryOptions, reload}= context;

  const { queryFn: mutationFilesFn }= queryFiles.deletes();
  const mutationFiles = useMutation({
    mutationFn: mutationFilesFn
  })
  
  const ids= JSON.stringify(checked.map(data=> data.id))
  const { queryFn: mutationFn }= queryOptions.deletes(ids);
  const mutationDelete = useMutation({
    mutationFn
  }) as any

  const [status, setStatus]= useState<'edit'|'pending'|'confirm'>('edit')


  const {handleAuthRefresh}= useTokenAuthRecall({ 
    submit : (log)=> submit(log),
    expiredCallback: (auth)=> {
      toaster.warn({text: '재시도'}, { 
        ...toastOpt, 
        // toastId: toastCreateId 
      })
    },
    unauthorizedCallback: (auth)=> {
      toaster.error({text: '사용자 인증이 되지 않았습니다.'}, { ...toastOpt, toastId: toastDeleteId })
    }  
  });

  const submit= (log)=> {
    const data= checked
    setStatus('pending')
    fileDelete({log, data});
    // return;
    toaster.loading({text: "처리중입니다..."}, { ...toastOpt, toastId: toastDeleteId })
    mutationDelete.mutate({ data, access_token: log?.access_token })
    
  }

  const fileDelete= ({log, data})=> {
    toaster.loading({text: "파일을 처리중입니다..."}, { 
      ...toastOpt, toastId: toastFileDeleteId, 
      // closeButton: true,
     })
    const paths= JSON.stringify(checked.map(data=> `/${keyname}/${data.key}`))
    mutationFiles.mutate({
      paths,
      access_token: log?.access_token
    })
    
  }


  useEffect(()=> {
    console.log(deleteOn)
    if( deleteOn ) {

      if( !checked.length ) {
        toaster.error(
          { text: '선택된 데이터가 없습니다.' }, 
          { ...toastOpt, toastId: toastDeleteId, onClose: ()=> setDeleteOn(false) }
        )
        return
      }
      toasterConfirm({
        text: <p className="break-keep text-center">
          <span className="text-error font-black">{checked.length}개</span>의 데이터가 삭제됩니다. 진행하시겠습니까?
          </p>,
        agree: (e)=> {
          toaster.update(toastDeleteId, 
            { text:  "삭제 처리중입니다..." },
            { 
              ...toastOpt,
              type: "loading", 
              isLoading: true, 
              closeButton: false,
              // autoClose: 3000, 
              // hideProgressBar: true ,
            }
          )
          handleAuthRefresh(log)
          // handleUpdate({ log, data, file }, true)
        },
        disagree: (e)=> {
          toast.dismiss(toastDeleteId)
        },
        type: 'error'
        
      }, { ...toastOpt, toastId: toastDeleteId, onClose: ()=> setDeleteOn(false)})
      
    }
  }, [deleteOn])



  useEffect(()=> {
    if( mutationDelete.data ) {
      if( mutationDelete.data?.status != 'success' ) {
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastDeleteId, 
            { text: JSON.stringify(mutationDelete.data) },
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
      if( mutationDelete.data?.status == 'success' ) {
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastDeleteId, 
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
        // init();
        reload({filters, page, pageSize})
        return;
      }
    }
    
  }, [mutationDelete.data])

  useEffect(()=> {
    /* console.log(mutationFiles.data, 
      _.flattenDeep(mutationFiles.data)
    ) */
    if( mutationFiles.data ) {
      const res= _.flattenDeep(mutationFiles.data);
      const err= res.filter( res=> {
        return res.response.status != 200
      })

      if( isEmptyArray(err) ) {
        // setTimeout(e=> {
          setStatus('confirm')
          toaster.update(toastFileDeleteId, 
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
          toaster.update(toastFileDeleteId, 
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

  return (
    <div className="">
      <ToastContainer
        containerId={toastContainerId}
        // stacked
        position="bottom-center"
        // limit={1}
        className={""}
        // transition={bounce}
      />
    </div>
  )
}