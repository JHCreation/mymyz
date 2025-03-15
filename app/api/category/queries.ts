import {fastapi, FastapiProps} from '~/api/api';
import {Category, CategoryCreate, CategoryList, CategoryResponse} from '~/@types/category';
import QueryString from 'qs';
import { CommCreate, CommList, CommResponse } from '~/@types/queryType';

type ResponseList= CommList<Category>
class CategoryQuery {
  name: string
  constructor(name) {
    this.name= name
  }
  getAll= async ()=> {
    const res= await fastapi({ 
      operation: 'GET', url: `/api/${this.name}/list-all`, 
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    })
    return res as CommResponse<Category>;
  }

  filterList= async ({ params, page, size })=> {
    const { data, access_token }= params;
    const pg= params?.page ?? (page ?? 1);
    const sz= params?.size ?? (size ?? '');
    const res= await fastapi<ResponseList>({ 
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
    return res?.data as ResponseList
  }

  getList= async ({ params, page, size })=> {
    // console.log('cate list ', `/api/${this.name}/list-all`)
    console.log('get datas Client')
    const res= await fastapi<ResponseList>({ 
      operation: 'GET', url: `/api/${this.name}/list`, 
      // operation: 'GET', url: `/user/test`, 
      params: { page : page ?? 1, size: size ?? '' },
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    })
    // console.log('res:', res)
    return res?.data as ResponseList;
  }

  create= async (params)=> {
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

  update= async ({params, id})=> {
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

  deletes= async ({params, ids})=> {
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

  delete= async ({params, id})=> {
    const { data, access_token }= params;
    const option: FastapiProps= { 
      operation: 'DELETE', 
      url: `/api/${this.name}/delete/${id}`, 
      access_token,
    }
    const res= await fastapi<CommCreate>(option)
    return res?.data as CommCreate;
  }

  /* async getCategoryList({ page }) {
    // console.log('get datas Client page', page)
    const option: FastapiProps= { 
      operation: 'GET', url: '/api/question/list-next', 
      params: { page : page ?? 1 },
      option: { 
        // cache: 'force-cache'
        // cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    }
    if( page ) option.params= { page }
    const res: CategoryList= await fastapi(option)
    return {...res, 
      // nextCursor: page+1
    } as CategoryListInfinite;
  } */

}


export default CategoryQuery