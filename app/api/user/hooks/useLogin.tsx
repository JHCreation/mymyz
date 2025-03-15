
import { ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryOptions from "@/api/user/queryOption";
// import { useRecoilState } from "recoil";
// import { logState } from "@/recoil/atoms/log";

import { JwtPayload, jwtDecode } from "jwt-decode";
import useUserRefresh from "./useUserRefresh";
import { LogTypes } from "@/@types/user";
import { useLogState } from "~/store/store";

interface Props {
  type?: string
  id: string
  success_callback?: (data)=> void
}
export default function useLogin ({ type, id, success_callback }:Props) {
  // const [log, setLog]= useRecoilState(logState);
  const { log, setLog }= useLogState()

  const { queryKey, queryFn }= queryOptions.snsLogin({type, id});
  const query = useQuery({
    queryKey, queryFn,
    /* select: (data)=> {
      console.log(data)
      setLog({
        access_token: data.access_token,
        userid: data.userid,
        state: true,
        is_login: true,
      })
      success_callback && success_callback(data)
      return data;
    } */
    
  })
  const { data, isPending, isSuccess, isError }= query;
  useEffect(()=> {
    console.log(data, isSuccess)
    if( isSuccess && data ) {
      if( data?.data?.access_token ){
        const { data : { access_token, userid } }= data;
        setLog({
          access_token: access_token,
          userid: userid,
          state: true,
          is_login: true,
        })
        success_callback && success_callback(data)
      }
    }
  }, [data, isSuccess])

  return { log, data, isPending, isError, isSuccess }
}


interface TokenAuthResponse {
  token: JwtPayload | null
  status: 'expired' | boolean
}
export const tokenAuthorization= (log:LogTypes)=> {
  if( log?.access_token ) {
    const decoded = jwtDecode<JwtPayload>(log?.access_token);
    const isExpired= decoded?.exp && decoded.exp < Date.now()/1000;
    console.log(decoded)
    return {
      token: decoded,
      status: isExpired ? 'expired' : true
    } as TokenAuthResponse
  }

  if( !log?.access_token ) {
    return {
      token: null,
      status: false
    } as TokenAuthResponse
  }
  
}

export const useTokenAuth= ()=> {
  const { handleRefresh }= useUserRefresh({})
  const authorization= async (log)=> {
    if( log?.access_token ) {
      const decoded = jwtDecode<any>(log?.access_token);
      const isExpired= decoded?.exp < Date.now()/1000;
      // console.log(log, decoded, isExpired)
      if( isExpired ) {
        handleRefresh()
        return
      }
    }
    
    if( !log?.access_token ) {
      handleRefresh()
    }
  }
  return { authorization }

  
}


interface TokenAuthRecallProp {
  submit: (log)=> void
  expiredCallback?: (auth)=> void
  unauthorizedCallback?: (auth)=> void
}
export const useTokenAuthRecall= ({ submit, expiredCallback, unauthorizedCallback }:TokenAuthRecallProp)=> {
  // const [authStatus, setAuthStatus]= useState<null|'refresh'>(null)
  const { handleRefresh }= useUserRefresh({
    success_callback: (data, variables, context, response)=> {
      // console.log(response)
      // const { log }= response;
      handleAuthRefresh(response?.log || null)
    }
  })

  const handleAuthRefresh= (log)=> {
    const auth= tokenAuthorization(log)
    console.log(log, auth)
    if( auth?.status == 'expired' ){
      expiredCallback && expiredCallback(auth);
      handleRefresh()
      // setAuthStatus('refresh')
      // authorization(log)
      return;
    }
    if( !auth?.status ) {
      unauthorizedCallback && unauthorizedCallback(auth)
      return;
    }
    submit(log)
  }

  /* const authorization= (log)=> {
    if( log?.access_token ) {
      const decoded = jwtDecode<any>(log?.access_token);
      const isExpired= decoded?.exp < Date.now()/1000;
      // console.log(log, isExpired)
      if( isExpired ) handleRefresh()
    }
    
    if( !log?.access_token ) {
      handleRefresh()
    }
  } */
  return {handleAuthRefresh}
}