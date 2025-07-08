import { LoaderFunctionArgs } from "@remix-run/node"
import { redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { refreshTokenCookie, refreshTokenKey } from "~/components/auth/cookies.server";
import { Loading } from "~/components/ui/Loading";
import { LoadingsFull } from "~/layout/admin/loading/AdminLoading";
import { useLogState } from "~/store/store";

export const loader= async ({ request }: LoaderFunctionArgs) => {
    
    const url = new URL(request.url);
    const access_token:string|null = url.searchParams.get("access_token");
    const refresh_token:string|null = url.searchParams.get(refreshTokenKey);
    const redirect_uri = url.searchParams.get("redirect_uri");
    const userid = url.searchParams.get("userid");
    const error = url.searchParams.get("error");
    // console.log(access_token, redirect_uri)

    if( access_token && redirect_uri ) {
        const decoded = jwtDecode<any>(access_token);
        const isExpired= decoded?.exp < Date.now()/1000;
        // console.log(log, decoded, isExpired)
        if( isExpired ) {
            // handleRefresh()
            return null
        }
        // return redirect('/admin')
        const headers= {
            "Set-Cookie": await refreshTokenCookie.serialize(refresh_token),
        }
        return Response.json({ access_token, redirect_uri, userid }, {
            headers
        })
        // return redirect()
    }
    if( error && redirect_uri ) {
        // return redirect(`/login?error=${error}`);
        const url = new URL(redirect_uri)
        return redirect(`/login?error=${error}&referer=${url.pathname}`);
    }

    
    
    return redirect("/login");
    // return null
    
}

export default function Authorization  () {
    const response = useLoaderData<typeof loader>();
    const {log, setLog}= useLogState()
    const navigate= useNavigate()

    useEffect(()=> {
        if( response?.access_token ) {
            setLog({
                access_token: response.access_token,
                userid: response.userid,
                state: true,
                is_login: true,
            })
            const url = new URL(response.redirect_uri)
            console.log(url.pathname) // 👉 "/admin
            navigate(url.pathname);

        }
    }, [response])
    // console.log(access_token, redirect_uri)
    
    return (
        <div className="bg-base-100">
            <LoadingsFull/>
        </div>
    )
}