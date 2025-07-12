import { useContext, useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { DataListContext } from './GridDataType';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import _ from 'lodash';
import FileField from '~/components/fields/FileField';
import CheckField from '~/components/fields/CheckField';
import { FieldsProvider, SchemaType } from '~/components/fields/FieldType';
import RadioField from '~/components/fields/RadioField';
import TextField from '~/components/fields/TextField';
import TextFieldArray from '~/components/fields/TextFieldArray';
import queryFiles from '~/api/_files/queryOption';
import { useMutation } from '@tanstack/react-query';
import { toaster } from "@/components/ui/Toast";
import { ToastContainer, ToastOptions } from 'react-toastify';
import { authorization } from '~/api/auth/useAuth';
import { useNavigate } from '@remix-run/react';
import Dialog from '~/components/ui/Dialog';
import { CloseIcon } from './comps';
import { Loading } from '~/components/ui/Loading';
import { LogTypes } from '~/@types/user';
import { DataToasterType, request, sortParams } from './Requests';
import ToggleField from '~/components/fields/ToggleField';
import EditorField from '~/components/fields/EditorField.client';
// import EditorInput from '~/components/fields/EditorInput';

const toastContainerId= 'categoryCreateToast';
const toastCreateId= 'categoryCreate';
const toastFileCreateId= 'categoryFileCreate';
const toastOpt:ToastOptions= {
  containerId: toastContainerId,
  autoClose: 3000
}

const toastCreate:DataToasterType= {
  instance: toaster,
  option: toastOpt,
  id: toastCreateId
}

export default function Create(props) {
  const { open, setOpen }= props;
  return (

    <Dialog open={open} setOpen={setOpen} outsidePress={true} escapeKey={false} contentClassName="p-0">
      <Dialog.Body>
        <CloseIcon handleClose={e=>setOpen(false)} />
        <CreateInput />
      </Dialog.Body>

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
    </Dialog>
  )
}


function CreateInput(props) {
  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, defaultFilters, category, page, setPage, pageSize, log, setLog, queryOptions, reload, useSchema, tableName, idKey}= context;

  
  const { queryFn: mutationFilesFn }= queryFiles.upload();
  const mutationFiles = useMutation({
    mutationFn: mutationFilesFn
  })
  
  const { queryFn: mutationFn }= queryOptions.create();
  const mutationCreate = useMutation({
    mutationFn
  })

  const defs = useSchema({ tableName, method: "create" });
  const schema = defs?.schema;
  const schemas = defs?.schemas;
  const defaultValues = defs?.defaultValues;
  useEffect(()=> {
    reset(defaultValues);
    console.log(defaultValues)
  }, [defaultValues])
  // const defaultValues = schema ? _.mapValues(schema, 'defaultValue')  : {};
  
  
  // type FormField = typeof schema;
  type FormData = z.infer<typeof schemas>;
  type FiledKeys = keyof FormData;
  const method= useForm<FormData>({
    resolver: schemas ? zodResolver(schemas) : undefined,
    mode: 'onTouched',
    defaultValues
  })
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors,  },
  } = method

  const navigate= useNavigate()
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data)
    // const copy = _.cloneDeep(data);
    // _.unset(copy, 'thumb_file')
    // const { params, files } = Object.entries(data).reduce((acc, [key, value]:[string, any]) => {
    //   if (schema[key].type === 'file') {
    //     const fileList = Array.isArray(value) ? value : value ? [value] : [];
    //     if (fileList.length > 0) {
    //       acc.files[key] = fileList;
    //     }
    //     // acc.files[key] = value;
    //   } else {
    //     acc.params[key] = value;
    //   }
    //   return acc;
    // }, { params: {}, files: {} });
    const parameter= sortParams({ schema, values: data })
    // console.log(params, files)
    authorization({ 
      log, 
      setLog,
      valid: (log)=> handleMutations({ data: parameter.params, files: parameter.files, log }),
      invalid: (log)=> {
        toaster.error({text: '사용자 인증이 되지 않았습니다. 다시 로그인 해주세요.'}, { ...toastOpt, toastId: toastCreateId })
        navigate('/login')
      }
    })
    
  }

  const handleMutations = async ({data, files= undefined, log}:{
    data: any
    files?: any
    log: LogTypes | null
  }) => {
    console.log(data)
    if( data ){
      const dataTasks = [
        { 
          name: "datas", 
          fn: () => {
            // console.log('데이터 뮤테이트 함수 실행')
            return mutationCreate.mutateAsync({ data, access_token: log?.access_token } as any)
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
  
      toaster.loading({text: "처리중입니다..."}, { ...toastOpt, toastId: toastCreateId })
      const dataPromisese= request({ 
        toaster : toastCreate,
        tasks: dataTasks,
      })
  
      Promise.all(dataPromisese).then(res=> {
        console.log(res, '데이터 응답들')
        const hasSuccess = res.some((r:any) => r === "성공");
        
        if ( hasSuccess ) {
            // console.log("하나 이상 성공했습니다!");
            toastCreate.instance.update(toastCreate.id, 
                { text: '성공입니다.' },
                { 
                  ...toastCreate.option,
                  type: "success", 
                  isLoading: false, 
                  autoClose: 2000, 
                  hideProgressBar: true ,
                  // onClose: ()=> setStatus('edit')
                }
            )
            reset(defaultValues)
            defs.init()
            reload({filters, page, pageSize})
        } else {
          toaster.error({text: "오류가 발생했습니다."}, { 
            ...toastOpt, toastId: toastCreateId,
            type: "error", autoClose: 2000, 
           })
        }
      })
    }
    

    

    if (files && Object.keys(files).length > 0) {
      const fileTasks = [
        { 
          name: "files", 
          fn: () => Promise.all(
            Object.keys(files).map( key=> {
              console.log('파일 뮤테이트 함수 실행')
              return mutationFiles.mutateAsync({
                key,
                fileDatas: {file: files[key]},
                access_token: log?.access_token
              })
            })
          ),
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
      
      // toaster.loading({text: "파일요청 처리중입니다..."}, { ...toastOpt, toastId: toastFileCreateId })
      const filePromisese= request({ 
        toaster : toastCreate,
        tasks: fileTasks,
      })
      Promise.all(filePromisese).then((res:any)=> {
        console.log(res, '파일 응답들')
        
        /* if ( !res.error || res.error.length == 0 ) {
            toaster.update(toastFileCreateId, 
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
        } */

        if ( res.error && res.error.length > 0 ) {
          toaster.error(
            { text: '파일 전송에 문제가 생겼습니다.' },
            { 
              ...toastOpt, 
              toastId: toastFileCreateId,
              type: "error", 
              autoClose: 2000, 
            }
          )
        }
      })
      
    }
  
         
    
    
  };
  
  
  console.log(errors, getValues())
  if( !schemas ) return null
  const schemaKeys = Object.keys(schema) as FiledKeys[]

  return (
    <>
    {mutationCreate.isPending ? (
      <div className="max-h-dvh-nav min-h-80 flex items-center justify-center">
        <Loading/>
      </div>
    ) : (
      <FieldsProvider value={{ control, schema, method: 'create' }} >
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onSubmit)} className='bg-base-100 flex flex-col p-10'>
            { schemaKeys.map((key:any)=> {
              const currentSchema:SchemaType= schema[key]
              const name= currentSchema['name']
              const type= currentSchema['type']
              const Custom= currentSchema?.['custom'] 
              return (

                <div key={key} className="">

                  {
                    Custom ?
                      <Custom name={key} defaultValues={defaultValues} /> :
                      <>
                      {
                        type == 'text' &&
                        <TextField name={key} defaultValues={defaultValues} />
                      }
  
                      {
                        type == 'text-array' &&
                        <TextFieldArray name={key} defaultValues={defaultValues}/>
                      }
  
                      {
                        type == 'file' && 
                        <FileField name={key} idKey={idKey} defaultValues={defaultValues}
                        />
                      }
  
                      {
                        type == 'checkbox' && 
                        <CheckField name={key} defaultValues={defaultValues}/>
                      }
                      {
                        type == 'radio' && 
                        <RadioField name={key} defaultValues={defaultValues}/>
                      }
                      {
                        type == 'toggle' && 
                        <ToggleField name={key} defaultValues={defaultValues}/>
                      }
                      {
                        type == 'editor' && 
                        // <EditorInput name={key} defaultValues={defaultValues} toastOption={toastOpt}/>
                        <EditorField name={key} defaultValues={defaultValues} toastOption={toastOpt}/>
                      }
                      </>
                  }
                  
                  
                </div>
              )
            })}


            <button type="submit" className='btn btn-primary mt-4'>등록</button>
          </form>
        </FormProvider>
      </FieldsProvider>
    )}
    
    </>
  )
}