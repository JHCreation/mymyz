import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useQuill } from 'react-quilljs-vite-fix';
// import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // 이 import는 클라이언트 사이드에서만 실행됩니다.
import 'quill/dist/quill.bubble.css'; // 이 import는 클라이언트 사이드에서만 실행됩니다.
import './quill-style.css'; 
import MagicUrl from 'quill-magic-url'
import QuillResizeImage from 'quill-resize-image';
import _ from 'lodash';
import queryFiles from '~/api/_files/queryOption';
import { useMutation } from '@tanstack/react-query';
import { useEnv, useLogState } from '~/store/store';
import { type FileInfoType } from '~/api/_files/queries';
import path from 'path-browserify';
import { format } from 'date-fns';
import { toasterConfirm, toaster } from "@/components/ui/Toast";
import { SchemaType, useFields } from './FieldType';
import { useController, useFormContext } from 'react-hook-form';
import { cn } from '~/utils/style';
import { DataListContext } from '~/layout/admin/_grid/GridDataType';
import Quill from 'quill'
import { authorization } from '~/api/auth/useAuth';
import { useNavigate } from '@remix-run/react';
if (!(Quill as any).__registered) {
  Quill.register('modules/magicUrl', MagicUrl)
  Quill.register('modules/resize', QuillResizeImage)
  ;(Quill as any).__registered = true
}

// Quill.register('modules/magicUrl', MagicUrl)
// Quill.register('modules/imageResize', QuillResizeImage)

/* const fontSizeArr = ['8px','9px','10px','12px','14px','16px','20px','24px','32px','42px','54px','68px','84px','98px'];
const toolbarOptions = [
	[{ 'size': fontSizeArr }],
] */
// const Size = Quill.import('attributors/style/size');
// console.log(Size)
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ 'header': 1 }, { 'header': 2 }, { 'header': 6 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

const font= [
  {
    key: 'SUITE',
    family: 'SUITE'
  },
  {
    key: 'Gmarket-Sans',
    family: 'GmarketSans'
  },
  {
    key: 'Pretendard',
    family: 'Pretendard'
  },
]
const fontArr = font.map(val=> val.family)
const fontSize = [
  // { key: 'xxs', size: '0.5rem' },
  { key: 'xs', size: '0.7em' },
  { key: 'sm', size: '0.85em' },
  { key: 'md', size: '1em' },
  { key: 'ml', size: '1.2em' },
  { key: 'lg', size: '1.6em' },
  { key: 'lm', size: '2.2em' },
  { key: 'xl', size: '3.2em' },
  { key: 'xxl', size: '4em' },
  { key: 'xxxl', size: '6em' },
];

const fontSizeArr = fontSize.map(val=> val.size)
const formats= [
  'bold', 'italic', 'underline', 'strike',
  'align', 'list', 'indent',
  'size', 'header',
  'link', 'image', 'video',
  'color', 'background', 'blockquote', 'code-block', 'script', 'font',
]
const placeholder = '내용을 입력해 주세요...';
const theme = 'snow';

export default function EditorField({ name, defaultValues, toastOption
  // id, keyName, option, value, handleValue, err, toastOption 
}) {

  const context= useContext(DataListContext);
  if( !context ) throw new Error('cannot find DataListContext')
  const {filterId, filters, setFilters, defaultFilters, category, page, setPage, pageSize, log, setLog, queryOptions, reload, useSchema, tableName, idKey, idName }= context;

  const { control, schema }= useFields();
  const schemaItem:SchemaType= schema[name]
  const { register, setValue, getValues, watch, formState: { errors } } = useFormContext()
  const { 
      field,
      fieldState: { invalid, isTouched, isDirty, error, isValidating },
      formState: { touchedFields, dirtyFields }
      } = useController({
      name,
      control,
      defaultValue: defaultValues?.[name] || '',
      // rules: { required: '파일을 첨부해주세요' },
  });
  const formValues = watch()

  // const theme = 'bubble';
  const modules:{} = useMemo(() => ({
      toolbar: '#toolbar',
      magicUrl: true,
      resize: {
        locale: {},
      },
  }), []);

  const { quill, quillRef, Quill } = useQuill({ theme, modules, formats, placeholder });
  useMemo(() => {
    
    
    if (Quill && !quill) {

      // import('quill-magic-url').then((mod) => {
      //   Quill.register('modules/magicUrl', mod.default);
      // })
      // import('quill-resize-image').then((mod) => {
      //   Quill.register('modules/resize', mod.default);
      // })

      var Size:any = Quill.import('attributors/style/size');
      Size.whitelist = fontSizeArr;
      Quill.register(Size, true);
      var Font:any = Quill.import('attributors/class/font');
      Font.whitelist = fontArr;
      Quill.register(Font, true);
    }
  }, [Quill, quill]);

  // if (Quill && !quill) {
  //   Quill.register('modules/magicUrl', MagicUrl);
  //   Quill.register('modules/resize', QuillResizeImage);
  // }
  console.log(formValues, idName)
  const navigate= useNavigate()
  const { selectLocalImage } = useInsertImage({tableName, keyName: name, idKey, id: formValues[idKey as any], quill, toastOption, navigate, getValues})
  
  
  React.useEffect(() => {
    
    if (quill) {
      console.log(quill)
      // Quill이 초기화되었을 때 필요한 로직을 여기에 작성하세요.
      // quill.setText(value)
      // if ((quill as any)._imageHandlerAttached) return;

      // const toolbar:any = quill.getModule('toolbar');
      // toolbar.addHandler('image', selectLocalImage);
      // (quill as any)._imageHandlerAttached = true;
      
      quill.root.innerHTML= defaultValues?.[name] || ''
      quill.on('text-change', (delta, oldDelta, source) => {
        // console.log('Text change!');
        // console.log(quill.getText()); // Get text only
        // console.log(quill.getContents()); // Get delta contents
        // console.log(quill.root.innerHTML); // Get innerHTML using quill
        // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
        // handleValue(name, quill.root.innerHTML)
        setValue(name, quill.root.innerHTML)
      });

      const res= quill.getModule('toolbar') as any
      res.addHandler('image', selectLocalImage) 

      /* quill.on("selection-change", (range) => {
        if (range) {
          quill.theme.tooltip.show();
          quill.theme.tooltip.position(quill.getBounds(range));
        }
      }); */
    }

  }, [quill]);

  // ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  // ['blockquote', 'code-block'],
  // ['link', 'image', 'video', 'formula'],
  
  return (
    
    <fieldset 
        className={`fieldset border px-4 pb-4 rounded-md 
            ${cn({ 
                // 'border-error border-1': error,
                // 'hidden': schemaItem?.hidden
            })}
        `}
    >
        <legend className="fieldset-legend px-2">{schemaItem?.name}</legend>
        
        <div className="pt-2">
            
            {/* <input className={`input w-full`} disabled={schemaItem?.disabled} {...register(name)} /> */}

            <div className="">
              <div id="toolbar" className=' sticky top-0 left-0 bg-base-300 z-20'>
                <select className='ql-font bg-base-100 mr-1' defaultValue={font[0].family}>
                  {
                    font.map(val=> <option key={val.key} value={val.family}>{val.key}</option> )
                  }
                </select>
                <select className="ql-size bg-base-100 mr-1" defaultValue={'1em'}>
                  {
                    fontSize.map(val=> <option key={val.key} value={val.size}>{val.key}</option>)
                  }
                </select>
                <select className="ql-header bg-base-100">
                  <option value="1">Header 1</option>
                  <option value="2">Header 2</option>
                  <option value="3">Header 3</option>
                  <option value="4">Header 4</option>
                  <option value="5">Header 5</option>
                  <option value="6">Header 6</option>
                </select>
                
                <button className="ql-bold" />
                <button className="ql-italic" />
                <button className="ql-underline" />
                <button className="ql-strike" />
                <select className="ql-align" />
                <button className='ql-indent' value="-1"/>
                <button className='ql-indent' value="+1"/>
                <button className="ql-script" value="sub" />
                <button className="ql-script" value="super" />
                
                <select className="ql-color" />
                <select className='ql-background' />
                
                <span className="ql-formats">
                  <button className="ql-link" />
                  <button className="ql-image" />
                  <button className="ql-video" />
                  <button className="ql-formula" />
                </span>

              </div>
              
              <div ref={quillRef} className={`border-base-content border-opacity-20 bg-base-100`} ></div>
            </div>

            
        </div> 
        {/* <p className="label text-error">{error?.message}</p> */}
        {/* <p className="label">{(errors as any)?.[name]?.required_error}</p> */}
    
    </fieldset>


    
  )
}


const useInsertImage= ({tableName, keyName, idKey, id, quill, toastOption, navigate, getValues})=> {
  const { log, setLog }= useLogState()
  const { env }= useEnv()
  const { queryFn: mutationFilesFn }= queryFiles.upload();
  const mutationFiles = useMutation({
    mutationFn: mutationFilesFn
  }) as any
  // Insert Image(selected by user) to quill
  const insertToEditor = (quill, url) => {
    const range = quill.getSelection();
    range && quill.insertEmbed(range.index, 'image', url);
  };

  // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
  const saveToServer = async (file) => {
    console.log('insert image init', id, getValues(idKey))
    const idValue= getValues(idKey)
    const now= format(new Date(), 'yyyyMMddHHmmss');
    const ext= path.extname(file.name);
    // const ext= '/';
    const base= file.name.split(ext)[0];
    const baseName= `${now}_${`${0}`.padStart(2, '0')}_${base}`;
    const fileName= `${baseName}${ext}`;

    const fileInfo:FileInfoType= {
      name: fileName,
      file,
      uploadPath: `/${tableName}/${idValue}/${keyName}`
    }
    

    authorization({ 
      log, 
      setLog,
      valid: (log)=> {
        mutationFiles.mutate({
          fileDatas: {
            file: [fileInfo]
          },
          access_token: log?.access_token
        })
      },
      invalid: (log)=> {
        toaster.error({text: '사용자 인증이 되지 않았습니다. 다시 로그인 해주세요.'}, { ...toastOption })
        navigate('/login')
      }
    })
    
    

  };
  useEffect(()=> {
    if( mutationFiles.data ) {
      console.log(mutationFiles.data[0][0].data.url)
      insertToEditor(quill, `${env.ENV.REMIX_PUBLIC_UPLOAD_PATH}/${mutationFiles.data[0][0].data.url}`)
    }

  }, [mutationFiles.data])

  // Open Dialog to select Image File
  const selectLocalImage = () => {
    console.log('open att files')
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    // input.setAttribute('accept', 'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml');
    
    input.click();

    input.onchange = () => {

      if( !input?.files ) return 
      const file = input.files[0];
      console.log(input.files)
      if( file.size > 1000000 ) {
        toaster.error({text: "파일 사이즈가 너무 큽니다."}, {
          ...toastOption
        })
        return
      } 
      saveToServer(file);
    };
  };
  return { selectLocalImage }
}