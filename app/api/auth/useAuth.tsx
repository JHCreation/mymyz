import { jwtDecode } from "jwt-decode";
import { LogTypes, UserToken } from "~/@types/user";
import { LogAction, useLogState } from "~/store/store";



export interface RefreshResponse {
    res: UserToken | null
    log: LogTypes | null
}
const requestRefresh= async ():Promise<RefreshResponse>=> {
    const res= await fetch('/bff/refresh', {
        method: 'POST'
    })
    const data= await res.json()
    let responseLog:RefreshResponse['log']= null
    if( data ) {
        const { access_token, userid }= data;
        responseLog= {
            access_token: access_token,
            userid: userid,
            state: true,
            is_login: true,
        }
    }
    return { res: data, log: responseLog }
}

const isTokenValid= (token)=> {
    if( !token ) return false
    const decoded = jwtDecode<any>(token);
    const isValid= decoded?.exp > Date.now()/1000;
    return isValid
}

interface AuthorizationProps {
    log: LogTypes
    setLog: LogAction['setLog']
    valid?: (log:RefreshResponse['log'])=> void
    invalid?: (log:RefreshResponse['log'])=> void
    expired?: (log:RefreshResponse['log'])=> void
}
export const authorization= async ({log, setLog, valid, invalid, expired}:AuthorizationProps)=> {
    const isValid= isTokenValid(log?.access_token)
    if( isValid ) {
        valid && valid(log)
        return
    }
    if( !isValid ) {
        expired && expired(log)
        const { res, log: newLog }= await requestRefresh()
        console.log('refresh 되었음.', newLog)
        if( newLog?.access_token ) {
            setLog(newLog)
            valid && valid(newLog)
        }
        if( !newLog?.access_token ) {
            invalid && invalid(newLog)
            handleLogout(setLog)
            throw new Error("Invalid or expired token(토큰인증 실패)"); 
        }
    }
}

export const handleLogout= (setLog)=> {
    fetch('/bff/delete', {
        method: 'POST'
    })
    setLog({
        access_token: '',
        userid: '',
        state: false,
        is_login: false
    })
}


// export const useTokenAuthorize= ()=> {
//     const {setLog}= useLogState();
    
//     const authorization= async ({log, setLog, apiUrl, domain, referer})=> {
//         if( log?.access_token ) {
//             const decoded = jwtDecode<any>(log?.access_token);
//             const isExpired= decoded?.exp < Date.now()/1000;
//             if( isExpired ) {
//                 return handleRefreshToken(setLog)
//             }
//         }
        
//         if( !log?.access_token ) {
//             return handleRefreshToken(setLog)

//             // redirectForm({
//             //     actionUrl: `${apiUrl}/api/user/refresh-bridge`,
//             //     values: [
//             //         { key: 'callback_uri', value: `${domain}/authorization` },
//             //         { key: 'redirect_uri', value: `${domain}${referer}` },
//             //     ]
//             // })
//         }
//     }
//   return { authorization }
// }


/* export const useTokenAuthorize= ()=> {
    
    const authorization= async ({log, apiUrl, domain, referer})=> {
        if( log?.access_token ) {
            const decoded = jwtDecode<any>(log?.access_token);
            const isExpired= decoded?.exp < Date.now()/1000;
            if( isExpired ) {
                redirectForm({
                    actionUrl: `${apiUrl}/api/user/refresh-bridge`,
                    values: [
                        { key: 'callback_uri', value: `${domain}/authorization` },
                        { key: 'redirect_uri', value: `${domain}${referer}` },
                    ]
                })
                return
            }
        }
        
        if( !log?.access_token ) {
            redirectForm({
                actionUrl: `${apiUrl}/api/user/refresh-bridge`,
                values: [
                    { key: 'callback_uri', value: `${domain}/authorization` },
                    { key: 'redirect_uri', value: `${domain}${referer}` },
                ]
            })
        }
    }
  return { authorization }
} */

// export function redirectToRefreshBridge(refreshBridgeUrl) {


    
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = refreshBridgeUrl;
  
//     const input = document.createElement("input");
//     input.type = "hidden";
//     input.name = "redirect_uri";
//     input.value = window.location.href;
  
//     form.appendChild(input);
//     document.body.appendChild(form);
//     form.submit();
// }


// export function redirectForm ({ actionUrl, values }) {
//     const form = document.createElement('form')
//     form.method = 'POST'
//     form.action = actionUrl

//     const addField = (name: string, value: string) => {
//       const input = document.createElement('input')
//       input.type = 'hidden'
//       input.name = name
//       input.value = value
//       form.appendChild(input)
//     }

//     values.forEach(val => {
//         addField(val.key, val.value)
//     });

//     document.body.appendChild(form)
//     form.submit()
// }