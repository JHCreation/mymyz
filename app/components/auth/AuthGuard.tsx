import { useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { useEffect } from "react";
import { useLogState } from "~/store/store";
import qs from 'qs'
import { jwtDecode } from "jwt-decode";
import { authorization } from "~/api/auth/useAuth";

export default function AuthGuard ({ children, domain, fix }: { children, domain:string, fix?: boolean }) {
    const { log, setLog }= useLogState()
    
    // console.log('only Client!!!', log)
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location= useLocation()
    const { pathname }= location;
    /* const { queryKey, queryFn }= queryOptions.refresh();
      const query = useQuery({ 
        queryKey, queryFn, 
        // staleTime: 30*1000,
        // gcTime: 10000,
        enabled: !!log?.access_token
      })
    const { data, isPending, isLoading, isError, refetch }= query

    useEffect(() => {
      console.log(log)
      if (!isLoading && isError) {
          console.log('이동')
          navigate('/login'); // 인증 실패 시 로그인 페이지로 이동
      }
      if (!isLoading && !data?.access_token) {
          console.log('이동')
          navigate('/login'); // 인증 실패 시 로그인 페이지로 이동
      }
    }, [isLoading, isError, data, navigate, log]);

    useEffect(() => {
      if (!log?.access_token) {
        console.log('refetch!')
        refetch()
      }
    }, [refetch]); */
    // const apiUrl= typeof window !== 'undefined' ? window?.ENV?.REMIX_PUBLIC_API_URL : process.env.REMIX_PUBLIC_API_URL;
    const path= searchParams.get('referer')
    const referer= path ?? pathname
    useEffect(()=> {
      if( log?.state == null ) {
        authorization({log, setLog});
        return
      }
      if( !log?.is_login ) {
        console.log(referer)
        if( referer == '/login') return navigate(`/login`);
        const qsReferer= `?${qs.stringify({referer})}`
        navigate(`/login${qsReferer}`)
      }

      // if( !log?.is_login ) {
      //   // console.log(searchParams.get('referer'), pathname)
      //   // const isLoginPath= searchParams.get('referer') && pathname == '/admin/login'
      //   const referer= searchParams.get('referer') ?? pathname
      //   const qsReferer= `?${qs.stringify({referer})}`
      //   if( pathname != '/login' ) {
      //     navigate(`/login${qsReferer}`)
      //     return;
      //   }
      // }
    
      // if( log?.is_login && searchParams.get('referer') ) {
      //   return navigate(`${searchParams.get('referer')}`)
      // }
    }, [log])

    // if (isLoading) return <div className="h-dvh"><Loading/></div>;
    // if (isError) return null; // 이동 중
    // console.log(log)
    if( fix ) return <>
      {children}
    </>
    if ( log.state && log?.access_token ){
      const decoded = jwtDecode<any>(log?.access_token);
      const isExpired= decoded?.exp < Date.now()/1000;
      if( isExpired ) {
        authorization({log, setLog});
      } else {
        return (
          <>
            {children}
          </>
        )
      }
    } 
    
    
}