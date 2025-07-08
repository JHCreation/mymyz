import {fastapi, FastapiProps} from '@/api/api';
import QueryString from 'qs';
import { CommCreate, CommList } from '~/@types/queryType';

export const getQueryKey= (name)=> {
  const queryKeys = {
    all: [name] as const,
    list: (page: number, size?: number) => [`${name}-list`, page, size] as const,
    item: (id: string)=> [`${name}-item`, id] as const,
    infiniteList: () => [`${name}-list`] as const,
    create: [`${name}-create`] as const,
    update: [`${name}-update`] as const,
    delete: [`${name}-delete`] as const,
    deletes: [`${name}-deletes`] as const,
    filter: (page: number, size?: number) => [`${name}-filter`, page, size] as const,
  }
  return queryKeys
}

export const getQueryOptions= (name, queryKeys, Query)=> {
  const queryOptions = {
    // name,
    // // list: (page:number|undefined=undefined, size:number|undefined=undefined) => ({
    // //   queryKey: queryKeys.list(page, size),
    // //   queryFn: ()=> Query.list(page, size),
    // // }),
    // create: () => ({
    //   queryKey: queryKeys.create,
    //   queryFn: Query.create,
    // }),
    // update: () => ({
    //   queryKey: queryKeys.update,
    //   queryFn: Query.update,
    // }),
    // deletes: () => ({
    //   queryKey: queryKeys.deletes,
    //   queryFn: Query.deletes,
    // }),


    name,
    create: () => ({
      queryKey: queryKeys.create,
      queryFn: Query.createData,
    }),
    list: ( page: number, size?: number ) => ({
      queryKey: queryKeys.list(page, size),
      queryFn: (params)=>{
        return Query.getDataList({ url: `/api/${name}/list`, page, size })
      },
    }),
    item: (id) => ({
      queryKey: queryKeys.item(id),
      queryFn: (params)=>{
        return Query.getData(id)
      },
    }),
    filter: ( page: number, size?: number ) => ({
      queryKey: queryKeys.filter(page, size),
      queryFn: (params)=>{
        return Query.filterDataList({ params, page, size  })
      },
    }),
    update: (id) => ({
      queryKey: queryKeys.update,
      queryFn: (params)=> Query.updateData({params, id}),
    }),
    delete: (id) => ({
      queryKey: queryKeys.delete,
      queryFn:(params)=> Query.deleteData({params, id}),
    }),
    deletes: ( ids ) => ({
      queryKey: queryKeys.update,
      queryFn:(params)=> Query.deletesData({params, ids}),
      
    }),
    
  };

  return queryOptions
}

class CommQuery<T> {
  name: string
  constructor(name) {
    this.name= name
  }
 
  createData= async (params)=> {
    const { data, access_token }= params;
    const option: FastapiProps= { 
      operation: 'POST', 
      url: `/api/${this.name}/create`, 
      access_token,
      params: data
    }
    const res= await fastapi<CommCreate>(option)
    return res?.data as CommCreate;
  }

  getDataList= async ({ url, page, size })=> {
    const res= await fastapi<T>({ 
      operation: 'GET', url, 
      params: { page : page ?? 1, size: size ?? '' },
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    })
    return res?.data as T;
  }

  getData= async (id)=> {
    const res= await fastapi<T>({ 
      operation: 'GET', url: `/api/${this.name}/${id}`, 
      // params: { page : page ?? 1, size: size ?? '' },
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    })
    return res?.data as T;
  }

  filterDataList= async ({ params, page, size })=> {
    const { data, access_token }= params;
    const pg= params?.page ?? (page ?? 1);
    const sz= params?.size ?? (size ?? '');
    const res= await fastapi<T>({ 
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
    return res?.data as T
  }

  updateData= async ({params, id})=> {
    console.log(params, id, `/api/${this.name}/update/${id}`)
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


export default CommQuery;