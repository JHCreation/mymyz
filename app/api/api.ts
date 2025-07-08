import qs from "qs"
// import { useNavigate, useLocation  } from "react-router-dom"
 

export type CallbackType= (response?:any, json?:any, log?:any)=> void
type HandlerLogType= (LogoutProp)=> void
interface FastapiProp {
  operation: string
  url: string
  params?: any
  success_callback?: CallbackType
  failure_callback?: CallbackType
  access_token?: string
  handleLogout?: HandlerLogType
  handleRefresh?: HandlerLogType
  option?: any
}

export interface RefreshFailRedirectPorp {
  refresh_fail_redirect?: string | false |undefined
}
export type FastapiProps= FastapiProp & RefreshFailRedirectPorp
interface Res<T> {
  reponse: Response
  data: T
}
// if( typeof window !== 'undefined' ) console.log( window, 'process')
// const apiUrl= process.env.PUBLIC_API_URL;

export const fastapi = <T>({operation, url, params, success_callback, failure_callback, access_token, handleRefresh, refresh_fail_redirect, option}:FastapiProps):Promise<Promise<Res<T>|any>|any> => {
  const apiUrl= typeof window !== 'undefined' ? window?.ENV?.REMIX_PUBLIC_API_URL : process.env.REMIX_PUBLIC_API_URL;
  // console.log('apiUrl', apiUrl)
  // console.log(refresh_fail_redirect)
  let method = operation.toLowerCase();
  let content_type = 'application/json';
  let body = JSON.stringify(params)
  
  if(operation === 'login') {
    method = 'post'
    content_type = 'application/x-www-form-urlencoded'
    body = qs.stringify(params)
  }

  let _url = `${apiUrl}${url}`;
  if(method === 'get') {
    _url += "?" + new URLSearchParams(params)
  }

  let options:any = {
    method: method,
    headers: {
      "Content-Type": content_type
    },
    credentials: "include",
    cache: 'no-store',
    ...option
  }

  if (access_token) {
    options.headers["Authorization"] = "Bearer " + access_token
  }

  if (method !== 'get') {
    options['body'] = body
  }
  // options['credentials']= "include";
  // console.log(_url, options)

  return fetch(_url, options)
  .then(response => {
    // console.log(response, operation)
    if(response.status === 204) {  // No content
      if(success_callback) {
        success_callback(response)
      }
      return { response, data: '' }
    }

    return response.json()
    .then(json => {
      // console.log(response, json)
      if(response.status >= 200 && response.status < 300) {  // 200 ~ 299
        if(success_callback) {
          success_callback(response, json)
        }
        return {response, data: json}
        // return json;
      }

      /* if (operation !== 'login' && 
        ( response.status === 401 || response.status === 403)
       ) {
        return handleRefresh && handleRefresh({
          success_callback: (response, res, log)=> {
            console.log(log)
            fastapi({operation, url, params, success_callback, failure_callback, access_token: log.access_token})
          },
          refresh_fail_redirect
        })
      } */

      if (failure_callback) {
        return failure_callback(response, json)
      } else {
        // console.log(response, json)
        // return json
        return {response, data: json}
        // alert(JSON.stringify(json))
      }
      
      
    })
    .catch(error => {
      console.log(error)
      alert(JSON.stringify(error))
    })
  })
  .catch(error => {
    console.log('err: ',error)
    failure_callback && failure_callback(error)
  })
}
