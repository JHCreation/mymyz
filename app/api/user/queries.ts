import {fastapi, FastapiProps} from '@/api/api';
import {User, UserList, UserResponse, UserToken} from '@/@types/user';
import QueryString from 'qs';
import { CommCreate } from '~/@types/queryType';
import CommQuery from '../_comm/queries';
// import { NextRequest, NextResponse } from "next/server";

class UserQuery {
  name: string
  constructor(name) {
    // super(name);
    console.log(name)
    this.name= name
    console.log(name, this.name)
  }

  snsLogin (id) {
    return async (params)=> {
      
      const option: FastapiProps= { 
        operation: 'POST', 
        url: '/api/user/sns-login', 
        params: {userid: id}
      }
      const res= await fastapi<UserToken>(option)
      console.log(res)
      return res 
      
      /* const response= await fetch(`${apiUrl}/api/user/sns-login`, {
        method: 'post',
        headers: {
          "Content-Type": 'application/json'
        },
        credentials: "include",
        cache: 'no-store',
        body: JSON.stringify({userid: id})
      })
      .then(response=> response)

      const res= await response.json()
      .then(res=>res)
      .catch(err => {
        console.log(err)
      })
      console.log('server response:',response, res)
      return {response, data: res} as UserResponse<UserToken>; */
    }
    
  }

  async userLogin ({userid, password}) {
    const option: FastapiProps= { 
      operation: 'login', 
      url: '/api/user/login', 
      params: {username: userid, password}
    }
    const res= await fastapi<User>(option)
    return res?.data as UserToken;
  }

  async userLogout () {
    const option: FastapiProps= { 
      operation: 'POST', 
      url: '/api/user/logout', 
    }
    const res= await fastapi<User>(option)
    return res?.data as User;
  }

  async userRefresh () {
    const option: FastapiProps= { 
      operation: 'POST', 
      url: '/api/user/refresh', 
    }
    const res= await fastapi<UserToken>(option)
    return res?.data as UserToken;
  }

  getUserList= async ({ params, page, size })=> {
    // console.log('cate list ', `/api/${this.name}/list-all`)
    // console.log('get datas Client')
    const res= await fastapi<UserList>({ 
      operation: 'GET', url: `/api/${this.name}/list`, 
      // operation: 'GET', url: `/user/test`, 
      params: { page : page ?? 1, size: size ?? '' },
      option: { 
        cache: 'no-store', 
        // next: { revalidate: 10 }
      } 
    })
    // console.log('res:', res)
    return res?.data as UserList;
  }

  filterUserList= async ({ params, page, size })=> {
    const { data, access_token }= params;
    const pg= params?.page ?? (page ?? 1);
    const sz= params?.size ?? (size ?? '');
    const res= await fastapi<UserList>({ 
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
    return res?.data as UserList
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


export default UserQuery;