import { LoaderFunctionArgs } from "@remix-run/node";
import qs from 'qs'
import { refreshTokenCookie } from "~/components/auth/cookies.server";

export async function action({ request }: LoaderFunctionArgs) {
    const apiUrl= process.env.REMIX_PUBLIC_API_URL;
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const url = formData.get("url");
    const response= await fetch(`${apiUrl}/api/user/login`, { 
      method: 'POST',
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({ username, password, })
    })
    const data= await response.json()
    // console.log(response, data)

    if( data ) {
      const { access_token, userid, refresh_token }= data
      if( access_token ) {
        const headers= {
          "Set-Cookie": await refreshTokenCookie.serialize(refresh_token),
        }
        return Response.json({ access_token: data?.access_token, url, userid }, {
          headers
        })
      } else {
        return Response.json(data)
      }
    }

    return Response.json(data)

}
  