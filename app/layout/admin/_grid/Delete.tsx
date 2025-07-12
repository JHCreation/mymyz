import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import queryFiles from "@/api/_files/queryOption";
import { toaster, toasterConfirm } from "~/components/ui/Toast";
import { useTokenAuthRecall } from "~/api/user/hooks/useLogin";
import { isEmptyArray } from "~/utils/validate/utility";
import _ from "lodash";
import { DataListContext } from "./GridDataType";
import { authorization } from "~/api/auth/useAuth";
import { useNavigate } from "@remix-run/react";
import { request, type DataToasterType } from "./Requests";
import { LogTypes } from "~/@types/user";

const toastContainerId= 'categoryDeleteToast';
const toastDeleteId= 'categoryDelete';
const toastFileDeleteId= 'categoryFileDelete';
const toastOpt:ToastOptions= {
  containerId: toastContainerId,
  autoClose: 3000
}


// const toastContainerId= 'categoryCreateToast';
// const toastDeleteId= 'categoryCreate';
// const toastFileCreateId= 'categoryFileCreate';
// const toastOpt:ToastOptions= {
//   containerId: toastContainerId,
//   autoClose: 3000
// }

const toastDelete:DataToasterType= {
  instance: toaster,
  option: toastOpt,
  id: toastDeleteId
}
export default function Delete ({ checked, deleteOn, setDeleteOn }) {
  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, defaultFilters, category, page, setPage, pageSize, log, setLog, queryOptions, reload, tableName}= context;

  const { queryFn: mutationFilesFn }= queryFiles.deletes();
  const mutationFiles = useMutation({
    mutationFn: mutationFilesFn
  })
  
  const ids= JSON.stringify(checked.map(data=> data.id))
  const { queryFn: mutationFn }= queryOptions.deletes(ids);
  const mutationDelete = useMutation({
    mutationFn
  }) as any
  const navigate= useNavigate()

  const handleMutations = async ({params, log}:{
    params: any
    log: LogTypes | null
  }) => {
    console.log(params)
    // return
    if( params ){
      const dataTasks = [
        { 
          name: "datas", 
          fn: () => {
            // console.log('데이터 뮤테이트 함수 실행')
            return mutationDelete.mutateAsync({ data: params, access_token: log?.access_token } as any)
          },
          success: (res)=> {
            if( res?.status == 'success' ) {
              return '성공'
            } else {
              return '실패'
            }
          },
          // fail: (res)=> console.log(res),
          error: (err)=> console.log(err),
        },
      ];
  
      toaster.loading({text: "처리중입니다..."}, { ...toastOpt, toastId: toastDeleteId })
      const dataPromisese= request({ 
        toaster : toastDelete,
        tasks: dataTasks,
      })
  
      Promise.all(dataPromisese).then(res=> {
        const hasSuccess = res.some((r:any) => r === "성공");
        
        if ( hasSuccess ) {
            toastDelete.instance.update(toastDelete.id, 
              { text: '성공입니다.' },
              { 
                ...toastDelete.option,
                type: "success", 
                isLoading: false, 
                autoClose: 2000, 
                hideProgressBar: true ,
                // onClose: ()=> setStatus('edit')
              }
            )
            reload({filters, page, pageSize})

        } else {
          toaster.error({text: "오류가 발생했습니다."}, { 
            ...toastOpt, toastId: toastDeleteId,
            type: "error", autoClose: 2000, 
            })
        }
      })










      const fileTasks = [
        { 
          name: "files", 
          fn: () => Promise.all([fileDelete({log, data: params})]),
          success: (res)=> { 
            const responsese= _.flattenDeep(res);
            const err= responsese.filter( (res:any)=> res?.response?.status != 200)
            return {
              response: res,
              responsese,
              error: err
            }
          },
          // fail: (res)=> console.log(res),
          error: (err)=> console.log(err),
        },
        
      ]
      
      toaster.loading({text: "파일요청 처리중입니다..."}, { ...toastOpt, toastId: toastFileDeleteId })
      const filePromisese= request({ 
        toaster : toastDelete,
        tasks: fileTasks,
      })
      Promise.all(filePromisese).then((res:any)=> {
        console.log(res, '파일 응답들')
        
        if ( !res.error || res.error.length == 0 ) {
            toaster.update(toastFileDeleteId, 
              { text: '파일 처리 성공입니다.' },
              { 
                ...toastOpt, 
                type: "success", 
                isLoading: false, 
                autoClose: 2000, 
                hideProgressBar: true ,
                // onClose: ()=> setStatus('edit')
              }
            )
        }

        if ( res.error && res.error.length > 0 ) {
          toaster.error(
            { text: '파일 전송에 문제가 생겼습니다.' },
            { 
              ...toastOpt, 
              toastId: toastFileDeleteId,
              type: "error", 
              autoClose: 2000, 
            }
          )
        }
      })
    }
    

    
    
  };

  const submit= (log)=> {
    const data= checked
    authorization({ 
      log, 
      setLog,
      valid: (log)=> handleMutations({ params:data, log }),
      invalid: (log)=> {
        toaster.error({text: '사용자 인증이 되지 않았습니다. 다시 로그인 해주세요.'}, { ...toastOpt, toastId: toastDeleteId })
        navigate('/login')
      }
    })
    
  }

  const fileDelete= ({log, data})=> {
    // toaster.loading({text: "파일을 처리중입니다..."}, { 
    //   ...toastOpt, toastId: toastFileDeleteId, 
    //   // closeButton: true,
    // })
    const paths= JSON.stringify(checked.map(data=> `/${tableName}/${data.key}`))
    mutationFiles.mutate({
      paths,
      access_token: log?.access_token
    })
    
  }


  useEffect(()=> {
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
          // toaster.update(toastDeleteId, 
          //   { text:  "삭제 처리중입니다..." },
          //   { 
          //     ...toastOpt,
          //     type: "loading", 
          //     isLoading: true, 
          //     closeButton: false,
          //     // autoClose: 3000, 
          //     // hideProgressBar: true ,
          //   }
          // )
          // handleAuthRefresh(log)
          // handleUpdate({ log, data, file }, true)
          submit(log)
          
        },
        disagree: (e)=> {
          toast.dismiss(toastDeleteId)
        },
        type: 'error'
        
      }, { ...toastOpt, toastId: toastDeleteId, onClose: ()=> setDeleteOn(false)})
      
    }
  }, [deleteOn])



  // useEffect(()=> {
  //   console.log(mutationDelete.data)
  //   if( mutationDelete.data ) {
  //     if( mutationDelete.data?.status != 'success' ) {
  //       // setTimeout(e=> {
  //         // setStatus('confirm')
  //         toaster.update(toastDeleteId, 
  //           { text: JSON.stringify(mutationDelete.data) },
  //           { 
  //             ...toastOpt, 
  //             type: "error", 
  //             isLoading: false, 
  //             autoClose: 2000, 
  //             hideProgressBar: true ,
  //             // onClose: ()=> setStatus('edit')
  //           }
  //         )
  //       // }, 1000)
  //       return;
  //     }
  //     if( mutationDelete.data?.status == 'success' ) {
  //       // setTimeout(e=> {
  //         // setStatus('confirm')
  //         toaster.update(toastDeleteId, 
  //           { text: '성공입니다.' },
  //           { 
  //             ...toastOpt, 
  //             type: "success", 
  //             isLoading: false, 
  //             autoClose: 2000, 
  //             hideProgressBar: true ,
  //             // onClose: ()=> setStatus('edit')
  //           }
  //         )
  //       // }, 1000)
  //       // init();
  //       reload({filters, page, pageSize})
  //       return;
  //     }
  //   }
    
  // }, [mutationDelete.data])

  // useEffect(()=> {
  //   /* console.log(mutationFiles.data, 
  //     _.flattenDeep(mutationFiles.data)
  //   ) */
  //   if( mutationFiles.data ) {
  //     const res= _.flattenDeep(mutationFiles.data);
  //     const err= res.filter( res=> {
  //       return res.response.status != 200
  //     })

  //     if( isEmptyArray(err) ) {
  //       // setTimeout(e=> {
  //         // setStatus('confirm')
  //         toaster.update(toastFileDeleteId, 
  //           { text: '파일 처리 성공입니다.' },
  //           { 
  //             ...toastOpt, 
  //             type: "success", 
  //             isLoading: false, 
  //             autoClose: 2000, 
  //             hideProgressBar: true ,
  //             // onClose: ()=> setStatus('edit')
  //           }
  //         )
  //       // }, 1000)
  //       // init();
  //       return;
  //     }


  //     if( !isEmptyArray(err) ) {
  //       // setTimeout(e=> {
  //         // setStatus('confirm')
  //         toaster.update(toastFileDeleteId, 
  //           { text: `${JSON.stringify(mutationFiles.data)} Files!!!` },
  //           { 
  //             ...toastOpt, 
  //             type: "error", 
  //             isLoading: false, 
  //             autoClose: 2000, 
  //             hideProgressBar: true ,
  //             // onClose: ()=> setStatus('edit')
  //           }
  //         )
  //       // }, 1000)
  //       return;
  //     }
      
  //   }
    
  // }, [mutationFiles.data])

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