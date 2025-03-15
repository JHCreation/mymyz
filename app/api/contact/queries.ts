import {fastapi, FastapiProps} from '@/api/api';
import {ContactList as List} from './@type';
import QueryString from 'qs';
import { CommCreate } from '~/@types/queryType';
import CommQuery from '../_comm/queries';
// import { NextRequest, NextResponse } from "next/server";

class Queries {
  name: string
  constructor(name) {
    // super(name);
    console.log(name)
    this.name= name
    console.log(name, this.name)
  }

  getList= async ({ params, page, size })=> {
    // console.log('cate list ', `/api/${this.name}/list-all`)
    // console.log('get datas Client')
    const res= await fastapi<List>({ 
      operation: 'GET', url: `/api/${this.name}/list`, 
      // operation: 'GET', url: `/user/test`, 
      params: { page : page ?? 1, size: size ?? '' },
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    })
    // console.log('res:', res)
    return res?.data as List;
  }

  filterUserList= async ({ params, page, size })=> {
    const { data, access_token }= params;
    const pg= params?.page ?? (page ?? 1);
    const sz= params?.size ?? (size ?? '');
    const res= await fastapi<List>({ 
      operation: 'POST', 
      url: `/api/${this.name}/list`, 
      params: { page:pg , size:sz, filter: JSON.stringify(data) },
      access_token,
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    })
    console.log(res)
    return res?.data as List
  }

  updateData= async ({params, id})=> {
    console.log(params, id)
    const { data, access_token }= params
    // return
    const option: FastapiProps= { 
      operation: 'PUT', 
      url: `/api/${this.name}/update/${id}`, 
      params: data,
      access_token,
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    }
    const res= await fastapi<CommCreate>(option)
    return res?.data as CommCreate;
  }

  deletesData= async ({params, ids})=> {
    const { data, access_token }= params;
    console.log({ ids })
    const option: FastapiProps= { 
      operation: 'DELETE', 
      url: `/api/${this.name}/deletes`, 
      access_token,
      params: { ids }
    }
    const res= await fastapi<CommCreate>(option)
    return res?.data as CommCreate;
  }

  deleteData= async ({params, id})=> {
    const { data, access_token }= params;
    const option: FastapiProps= { 
      operation: 'DELETE', 
      url: `/api/${this.name}/delete/${id}`, 
      access_token,
    }
    const res= await fastapi<CommCreate>(option)
    return res?.data as CommCreate;
  }

}


export default Queries;