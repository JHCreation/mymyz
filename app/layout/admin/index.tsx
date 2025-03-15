

import { Outlet, redirect, useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import AdminWrapper from "./Wrapper"; 
import { useTokenAuth } from "~/api/user/hooks/useLogin";
import { useEffect } from "react";
import { useLogState } from "~/store/store";
import { toaster } from "~/components/ui/Toast";
import { ToastContainer } from "react-toastify";
import qs from 'qs'



const toastId= 'admin-main'
const exception= [
  '/login',
]
export default function Admin ({data}: { data?: any }) {
  
  const { log, setLog }= useLogState()
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate= useNavigate()
  const location= useLocation()
  const { pathname }= location;
  const except= exception.indexOf(pathname.split('/admin')[1])

  const {authorization}= useTokenAuth();


  useEffect(()=> {
    console.log('auth start', pathname, log)
    authorization(log)
  }, [pathname]);

  useEffect(()=> {
    console.log(log, pathname)
    if( log?.state == null ) return;
    if( !log?.is_login ) {
      console.log(searchParams.get('referer'), pathname)
      const isLoginPath= searchParams.get('referer') && pathname == '/admin/login'
      const referer= searchParams.get('referer') ?? pathname
      const qsReferer= `?${qs.stringify({referer})}`
      if( pathname != '/admin/login' ) {
        navigate(`/admin/login${qsReferer}`)
        return;
      }
    }
  
    if( log?.is_login && searchParams.get('referer') ) {
      return navigate(`${searchParams.get('referer')}`)
    }
    
  }, [log])

  const outletComp= <Outlet 
    // context={{data}}
  />
  if( except != -1 ) return outletComp
  if( !log.is_login ) return null
  
  return <AdminWrapper>
    {/* <div className="">test</div> */}
    <div className="">
    {outletComp}
    <Toaster/>
    </div>
  </AdminWrapper>
}


const Toaster = ()=> {
  const { log, setLog }= useLogState()


  useEffect(()=> {
    if( log?.state == null ) return;
    if( log.is_login ) {
      // console.log('login!!!', log?.state)
      // toaster.dismiss()
      toaster.success({ text: '로그인 되었습니다!!'}, { toastId })
    }
    
  }, [log])

  return (
    <ToastContainer
      // containerId={toastContainerIdMain}
      // stacked
      position="bottom-left"
      limit={1}
      hideProgressBar
    />
  )
}