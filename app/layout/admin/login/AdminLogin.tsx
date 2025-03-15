import { Link, useNavigate, useSearchParams } from "@remix-run/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, ToastOptions } from "react-toastify";
import useLogout from "~/api/user/hooks/useLogout";
import queryOptions from "~/api/user/queryOption"
import { Loading } from "~/components/ui/Loading";
import { toaster } from "~/components/ui/Toast";
import { useLogState } from "~/store/store";


const toastContainerId= 'userLoginToast';
const toastContainerId2= 'userLoginToast2';
const toastId= 'userLogin';
const toastId2= 'userLogin2';
const toastOpt:ToastOptions= {
  containerId: toastContainerId,
  autoClose: 2500,
  hideProgressBar: true,
  // autoClose: 3000
}

const toastOpt2:ToastOptions= {
  containerId: toastContainerId2,
  autoClose: 500,
  hideProgressBar: true,
  // autoClose: 3000
}
export default function AdminLogin () {

  const { log, setLog }= useLogState()
  const { handleLogout } = useLogout({})
  const navigate= useNavigate()
  const keyname= queryOptions.name;

  // queryOptions
  const { queryFn: mutationFn }= queryOptions.login();
  const mutation = useMutation({
    mutationFn
  })


  // Remember id, pw
  const [isRemember, setIsRemember] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId", "rememberUserPw"]);


  useEffect(() => {
    console.log(cookies)
    
    if (cookies.rememberUserId !== undefined || cookies.rememberUserPw !== undefined) {
      // setLoginForm({ ...loginForm, userId: cookies.rememberUserId });
      setId(cookies.rememberUserId)
      setPw(cookies.rememberUserPw)
      setIsRemember(true);
    }
  }, []);


  const handleOnChange = (e) => {
    const checked= e.target.checked;
    setIsRemember(checked);
    handleCookie({ checked, id, pw })
    
  };

  const handleCookie = ({checked, id, pw})=> {
    if (checked) {
      //쿠키에 userId 값 저장, 유효기간 2000초
      setCookie("rememberUserId", id, { maxAge: 3600*24 });
      setCookie("rememberUserPw", pw, { maxAge: 3600*24 });
    } else {
      //체크 안 되어 있으면 쿠키 삭제
      removeCookie("rememberUserId");
      removeCookie("rememberUserPw");
    }
  }

  const [id, setId]= useState('')
  const [pw, setPw]= useState('')
  const [loading, setLoading]= useState(false)

  const onChangeId= (e)=> {
    const { target: { value } }= e
    setId(value)
    handleCookie({ checked: isRemember, id: value, pw })
  }

  const onChangePw= (e)=> {
    const { target: { value } }= e
    setPw(value)
    handleCookie({ checked: isRemember, id, pw: value })
  }


  const submit= ()=> {
    if( id == '' || pw == '' ) {
      console.log('empty~')
      // toaster.dismiss();
      toaster.error({text: '값을 입력하세요.'}, { ...toastOpt, toastId })
      return
    }
    mutation.mutate({userid: id, password: pw})
    // toaster.loading({text: "처리중입니다..."}, { ...toastOpt, toastId: toastUpdateId })

  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit();
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(()=> {
    console.log(mutation)
    // if( mutation.isPending ) { setLoading(true) }
    if( mutation.isSuccess) {
      console.log(mutation.data)
      if( mutation?.data?.access_token ) {
        const { access_token, userid }= mutation?.data
        const responseLog= {
          access_token: access_token,
          userid: userid,
          state: 'login',
          is_login: true,
        }
        console.log(searchParams.get('referer'))
        if( searchParams.get('referer') ) return navigate(`${searchParams.get('referer')}`);
        navigate('/admin')
        // setLog(responseLog)
        // toaster.update({text: '값을 입력하세요.'}, { ...toastOpt, toastId: toastUpdateId })
      } else {
        // toaster.dismiss();
        toaster.error({text: '로그인에 실패했습니다.'}, { ...toastOpt, toastId: toastId2 })
        /* toaster.update(toastUpdateId,
          {text: '로그인에 실패했습니다. 업데이트'},
          {
            ...toastOpt, 
            type: "error",
          }
        ) */
      }
    } 
  }, [mutation.data])
  useEffect(()=> {
    if( ref?.current ) ref?.current?.focus()
  }, [log])
  
  const ref= useRef<HTMLInputElement>(null)



  const [showPw, setShowPw]= useState(false)
  
  return (
    log.state != null &&
    <div className="h-full min-h-dvh flex flex-col">

      {
        log && log.access_token && 
        <div className="m-auto w-full max-w-[450px] flex flex-col gap-2">
          <div className="">
            <div role="alert" className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-nowrap">로그인이 되어 있습니다.</span>
              <Link to="/admin" className="btn">
                메인으로
              </Link>
              <div className="btn btn-error" onClick={e=>handleLogout()}>로그아웃</div>
            </div>

            
          </div>
        </div>
      }
      {
        !log || !log?.access_token && 
        <div className="m-auto w-full max-w-[320px] flex flex-col gap-2">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="text" className="grow" placeholder="Username" 
              ref={ref}
              onChange={onChangeId}
              onKeyDown={handleKeyPress}
              value={id}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd" />
            </svg>
            <input type={showPw ? `text` : `password`} className="grow"
              onChange={onChangePw}
              onKeyDown={handleKeyPress}
              value={pw}
            />
            <div className="cursor-pointer text-gray-400">
              {!showPw && <IconEye onClick={e=>setShowPw(true)}  />}
              {showPw && <IconEyeOff onClick={e=>setShowPw(false)} 
            className="cursor-pointer" />}
            </div>
          </label>
          
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text">아이디/패스워드 기억하기</span>
              <input type="checkbox" checked={isRemember} onChange={handleOnChange} className="checkbox checkbox-success" />
            </label>
          </div>
              
          <div className="">
          {
            mutation.isPending &&
            <div className="btn btn-disabled w-full">
            <Loading size="xs" />
            </div>
          }
          {
            !mutation.isPending && <div className="btn w-full" onClick={e=>submit()}>로그인</div>
          }
          </div>
            
          <div className="">
            <ToastContainer
              containerId={toastContainerId}
              stacked
              position="bottom-center"
              limit={2}
              className={" z-[9999]"}
              // transition={bounce}
            />
            {/* <ToastContainer
              containerId={toastContainerId2}
              stacked
              position="bottom-center"
              limit={2}
              className={" z-[9999]"}
              // transition={bounce}
            /> */}
          </div>
        </div>
      }

      
    </div>
  )
}