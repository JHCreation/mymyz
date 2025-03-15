import {fastapi, FastapiProps} from '@/api/api';
import {FilesResponse, FilesUpload} from '@/@types/files';
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import QueryString from 'qs';





class FilesQuery {
  name: string
  apiUrl: string
  
  constructor(name) {
    this.name= name
    this.apiUrl= typeof window !== 'undefined' ? window?.ENV?.REMIX_PUBLIC_API_URL : process.env.REMIX_PUBLIC_API_URL;
  }
  
  

  uploadFiles= async (param)=> {
    console.log('uploads:',param)
    // return
    
    const { fileDatas: { file: files }, access_token }= param;
    /* const response= files.map(f=> {
      return handleFiles({ url: `${apiUrl}/api/${this.name}/uploads`, name: this.name, fileInfo: f, access_token })
    })
    return response */

    const promises = files.map(f => handleFiles({ url: `${this.apiUrl}/api/${this.name}/uploads`, name: this.name, fileInfo: f, access_token }));
    const res:FilesResponse<FilesUpload>[]= await Promise.all(promises);
    console.log(res);

    return res;
  }

  deleteFiles= async (param)=> {
    console.log('delete:', param)
    // return
    // const { fileDatas: { file: files }, access_token }= param;
    const { path, access_token }= param;

    const option: FastapiProps= { 
      operation: 'DELETE', 
      url: `/api/${this.name}/delete`, 
      params: {path},
      access_token,
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    }
    const delRes= await fastapi<any>(option)
    return delRes;
  }

  deletesFiles= async (param)=> {
    console.log('delete:', param)
    // return
    // const { fileDatas: { file: files }, access_token }= param;
    const { paths, access_token }= param;

    const option: FastapiProps= { 
      operation: 'DELETE', 
      url: `/api/${this.name}/deletes`, 
      params: {paths},
      access_token,
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    }
    const delRes:FilesResponse<FilesUpload>[]= await fastapi<any>(option)
    return delRes;
  }


  updateFiles= async (param)=> {
    console.log('update:', param)
    // return
    const { fileDatas: { file: files }, access_token }= param;
    console.log(param.fileDatas.uploadPath)

    /* const option: FastapiProps= { 
      operation: 'DELETE', 
      url: `/api/${this.name}/delete`, 
      params: { path: param.fileDatas.uploadPath },
      access_token,
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    } */
    const delRes:FilesResponse<FilesUpload>[]= await this.deleteFiles({path: param.fileDatas.uploadPath, access_token})
    // console.log(delRes)
    if( files?.length == 0 ) {
      return delRes;
    }
    
    //직렬 처리
    /* const res:any= []
    for (const f of files) {
      const response:FilesResponse<FilesUpload>[]= await handleFiles({ url: `${apiUrl}/api/${this.name}/update`,name: this.name, fileInfo: f });
      res.push(response)
    } */

    //병렬
    const promises = files.map(f => handleFiles({ url: `${this.apiUrl}/api/${this.name}/uploads`,name: this.name, fileInfo: f, access_token }));
    const res:FilesResponse<FilesUpload>[]= await Promise.all(promises);
    console.log(res);

    return res;
  }

  

}


export interface FileInfoType {
  id?: string
  method?: 'add'|'override'
  thumbnail?: string
  uploadFullPath?: string
  uploadRootPath?: string
  name: string
  uploadPath: string
  file: File
}

const handleFiles= async ({ url, name, fileInfo, access_token })=> {
  console.log(fileInfo)
  const { id, method, name: fileName, thumbnail, uploadPath, uploadFullPath, uploadRootPath }:FileInfoType= fileInfo;
  // const promise:Promise<any>[]= []
  const reponseResult:FilesResponse<FilesUpload>[]= []
  const formFile= fileInfo.file //formdata file 객체
  const file = formFile;
  const chunk_size = 1024 * 1024; // Chunk size set to 1 MB
  let offset = 0;
  let chunk_number = 0;
  if (file) {
    // Loop until all chunks are uploaded
    while (offset < file?.size) {
      console.log(chunk_number, formFile, String(Math.ceil(file?.size / chunk_size)))
      // Slice the file into chunks
      const chunk = formFile.slice(offset, offset + chunk_size);

      // Create a blob from the chunk
      const chunk_blob = new Blob([chunk], { type: file.type });

      // Create a FormData object to send chunk data
      const formData = new FormData();
      formData.append("file", chunk_blob);
      // formData.append("name", file.name);
      formData.append("name", fileName);
      formData.append("chunk_number", String(chunk_number));
      formData.append("total_chunks", String(Math.ceil(file?.size / chunk_size))
      );
      formData.append("path", uploadPath );

      // Send the chunk data to the server using fetch API

      const response= await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${access_token}`
        },
        credentials: "include",
        cache: 'no-store',
      });

      const res:FilesUpload= await response.json() 
      .then(json => json)
      .catch(error => console.log(error))
      console.log(response, res)

      // 중단
      reponseResult.push({response, data: res})
      if(!(response.status >= 200 && response.status < 300)) break;
      
      /* fetch(url, {
        method: "POST",
        body: formData,
      })
      .then(res=> {
        return res.json()
        .then(json=> reponseResult.push(json))
      }) */

      /* const option: FastapiProps= { 
        operation: 'POST', 
        url: `/api/${this.name}/uploads`, 
        params: {},
        option: { 
          cache: 'no-store', 
          // next: { revalidate: 10 }
        } 
      }
      const res= await fastapi(option) */


      // Update offset and chunk number for the next iteration
      offset += chunk_size;
      chunk_number += 1;
      // return res as FilesUpload;

    }
  }
  console.log(reponseResult)
  return reponseResult;

  /* Promise.all(promise)
  .then(res=> {
    console.log(res)
    const formData = new FormData();
    formData.append("status", 'final');
    fetch(`${apiUrl}/api/${name}/uploads`, {
      method: "POST",
      body: formData
    })
  }) */
}




export default FilesQuery