import { createCookie, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { refreshTokenCookie } from "~/components/auth/cookies.server";

export const action= async ({ request }: LoaderFunctionArgs )=> {
    // const cookieHeader = request.headers.get("Cookie");
    // const token = await refreshTokenCookie.parse(cookieHeader);
    return Response.json({ message : 'success' }, {
        headers: {
            "Set-Cookie": await refreshTokenCookie.serialize("", { maxAge: 0 }),
        },
    })

}