import React, { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs-vite-fix';
import 'quill/dist/quill.snow.css'; // 이 import는 클라이언트 사이드에서만 실행됩니다.
import 'quill/dist/quill.bubble.css'; // 이 import는 클라이언트 사이드에서만 실행됩니다.
import './quill-style.css'; 
// import Quill from 'quill';
import MagicUrl from 'quill-magic-url'
import QuillResizeImage from 'quill-resize-image';
import _ from 'lodash';
import queryFiles from '~/api/_files/queryOption';
import { useMutation } from '@tanstack/react-query';
import { useEnv, useLogState } from '~/store/store';
import { FileInfoType } from '~/api/_files/queries';
import path from 'path-browserify';
import { format } from 'date-fns';
import { toasterConfirm, toaster } from "@/components/ui/Toast";

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

export default function ClientSideQuillEditor({ id, tableName, keyName, option, value, handleValue, err, toastOption }) {
  // const theme = 'bubble';
  const modules = {
    // toolbar: toolbarOptions,
    toolbar: '#toolbar',
    magicUrl: true,
    resize: {
      locale: {},
    },
  };

  const { quill, quillRef, Quill } = useQuill({ theme, modules, formats, placeholder });
  
  if (Quill && !quill) { // For execute this line only once.
    Quill.register('modules/magicUrl', MagicUrl);
    Quill.register('modules/resize', QuillResizeImage);

    var Size:any = Quill.import('attributors/style/size');
    Size.whitelist = fontSizeArr;
    Quill.register(Size, true);
    var Font:any = Quill.import('attributors/class/font');
    Font.whitelist = fontArr;
    Quill.register(Font, true);
  }

  const { selectLocalImage } = useInsertImage({tableName, keyName, id, quill, toastOption})
  
  
  React.useEffect(() => {
    
    if (quill) {
      // Quill이 초기화되었을 때 필요한 로직을 여기에 작성하세요.
      // quill.setText(value)
      quill.root.innerHTML= value
      quill.on('text-change', (delta, oldDelta, source) => {
        console.log('Text change!');
        console.log(quill.getText()); // Get text only
        console.log(quill.getContents()); // Get delta contents
        console.log(quill.root.innerHTML); // Get innerHTML using quill
        console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
        handleValue(keyName, quill.root.innerHTML)
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
    
    <div className="">
      <div id="toolbar" className=' sticky top-0 left-0 bg-base-300 z-20'>
        <select className='ql-font bg-base-100 mr-1' defaultValue={font[0].family}>
          {
            font.map(val=> <option value={val.family}>{val.key}</option>
            )
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
      
      <div ref={quillRef} className={`${err==true ? 'border-error' : 'border-base-content border-opacity-20 '} bg-base-100`} ></div>
    </div>
  )
}


const useInsertImage= ({tableName, keyName, id, quill, toastOption})=> {
  const { log }= useLogState()
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
    const now= format(new Date(), 'yyyyMMddHHmmss');
    const ext= path.extname(file.name);
    // const ext= '/';
    const base= file.name.split(ext)[0];
    const baseName= `${now}_${`${0}`.padStart(2, '0')}_${base}`;
    const fileName= `${baseName}${ext}`;

    const fileInfo:FileInfoType= {
      name: fileName,
      file,
      uploadPath: `${tableName}/${keyName}/${id}`
    }

    mutationFiles.mutate({
      fileDatas: {
        file: [fileInfo]
      },
      access_token: log?.access_token
    })

  };
  useEffect(()=> {
    if( mutationFiles.data ) {
      // console.log(mutationFiles.data[0][0].data.url)
      insertToEditor(quill, `${env.ENV.REMIX_PUBLIC_UPLOAD_PATH}/${mutationFiles.data[0][0].data.url}`)
    }

  }, [mutationFiles.data])

  // Open Dialog to select Image File
  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
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