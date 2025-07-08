import { LoaderFunctionArgs } from "@remix-run/node";
import { UserToken } from "~/@types/user";
import { refreshTokenCookie } from "~/components/auth/cookies.server";

export const action= async ({ request }: LoaderFunctionArgs ):Promise<Response|null>=> {
    const apiUrl= process.env.REMIX_PUBLIC_API_URL;
    const cookieHeader = request.headers.get("Cookie");
    const token = await refreshTokenCookie.parse(cookieHeader);
    if( !token ) return null
    const param= JSON.stringify({
        refresh_token: token
    })
    console.log('refresh start')
    const res= await fetch(`${apiUrl}/api/user/refresh`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: param
    })
    const data:UserToken= await res.json()
    return Response.json(data)
}