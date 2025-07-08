import { Suspense } from "react";
import AdminLogin from "~/layout/admin/login/AdminLogin";
import { Await, defer, useLoaderData, useOutletContext } from "@remix-run/react";
// import { loader } from "./admin";
import { useAsyncError } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import AdminLogin1 from "~/layout/admin/login/Login";


export default function AdminLoginRoute () {

  const { domain } = useOutletContext<any>();
  // const { data }:any = useOutletContext<typeof loader>();
  // console.log('rootData', data)
  // const error:any = useAsyncError();
  // if( error )return <p>{error?.message}</p>;
  return (
    <>
    {/* <Suspense fallback={<div className="w-full h-dvh bg-blue-400">Loading data...</div>}> */}
      {/* <Await resolve={data}> */}
        {/* {(resolvedData) => resolvedData && <AdminLogin />} */}
        {/* <AdminLogin1 domain={domain}/> */}
      {/* </Await> */}
    {/* </Suspense> */}
    </>
  )
}