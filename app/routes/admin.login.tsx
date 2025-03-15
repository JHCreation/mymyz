import { Suspense } from "react";
import AdminLogin from "~/layout/admin/login/AdminLogin";
import { Await, defer, useLoaderData, useOutletContext } from "@remix-run/react";
// import { loader } from "./admin";
import { useAsyncError } from "@remix-run/react";
/* export const loader = async () => {
  
  const slowData = new Promise((resolve) => {
    setTimeout(() => resolve("Loaded after 2 seconds"), 2000); // 3초 지연
  });

  return defer({
    data: slowData,
  });
}; */

export default function AdminLoginRoute () {
  // const { data }:any = useLoaderData<typeof loader>();

  // const { data }:any = useOutletContext<typeof loader>();
  // console.log('rootData', data)
  // const error:any = useAsyncError();
  // if( error )return <p>{error?.message}</p>;
  return (
    <>
    {/* <Suspense fallback={<div className="w-full h-dvh bg-blue-400">Loading data...</div>}> */}
      {/* <Await resolve={data}> */}
        {/* {(resolvedData) => resolvedData && <AdminLogin />} */}
        <AdminLogin/>
      {/* </Await> */}
    {/* </Suspense> */}
    </>
  )
}