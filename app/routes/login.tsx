import { Suspense } from "react";
import { Await, Link, useLoaderData } from "@remix-run/react";
import AdminLogin1 from "~/layout/admin/login/Login";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Loading } from "~/components/ui/Loading";
import Login from "~/layout/admin/login/Login";
import { LoadingsFull } from "~/layout/admin/loading/AdminLoading";
import { ClientOnly } from "remix-utils/client-only";
import AuthGuard from "~/components/auth/AuthGuard";


export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const error:string|null = url.searchParams.get("error");
  const domain = url.origin;
  /* const slowData = new Promise((resolve) => {
    setTimeout(() => resolve("Loaded after 2 seconds"), 2000); // 3초 지연
  }); */

  return { domain, error };
}


export default function LoginIndex () {
  const { domain, error }:any = useLoaderData<typeof loader>();
  console.log('error', error)

  const getCookie= async ()=> {
    const res= await fetch('/bff/refresh', {
      method: 'POST'
    })
    const data= await res.json()
    console.log(data)
  }

  const login= async ()=> {
    const res= await fetch('/bff/login')
    const data= await res.json()
    console.log(data)
  }
  return (
    <>
    <div className="bg-base-100">
      {/* <LoadingsSection /> */}
      <ClientOnly fallback={<LoadingsFull/>}>
        {()=> <AuthGuard domain={domain} fix={true} >
          <Login domain={domain} error={error}/>
        </AuthGuard>}
      </ClientOnly>
      {/* <Suspense fallback={<LoadingsFull />}>
        <Await resolve={domain}>
          {(domain) => domain && <Login domain={domain} error={error}/>}
        </Await>
      </Suspense> */}
      {/* <div className="btn" onClick={e=> getCookie()}>Fetch</div> */}
      {/* <div className="btn" onClick={e=> fetch('/bff/delete')}>Delete</div> */}
      {/* <div className="btn" onClick={e=> login() }>login</div> */}
      {/* <Link to="/bff/login">login</Link> */}

      {/* <Link to="/bff/refresh">Refresh</Link> */}
      {/* <Link to="/bff/delete">Delete</Link> */}
    </div>
    </>
  )
}

