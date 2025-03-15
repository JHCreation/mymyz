

import Admin from "~/layout/admin";

import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno
import { Await, defer, MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import { lazy, Suspense } from "react";
import { ClientOnly } from "remix-utils/client-only";

export const links: LinksFunction = () => {
  return [
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180", },
    { rel: "icon",type: "image/svg+xml", sizes: "32x32", href: "/favicon/favicon-admin.svg" },
    { rel: "icon", type: "image/svg+xml", sizes: "16x16", href: "/favicon/favicon-admin.svg" },
    { rel: "manifest", href: "/favicon/site.webmanifest" },
    { rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#75a7b5" },
  ];
};

export const meta: MetaFunction = () => {
  return [
    { title: "미마이즈" },
    { name: "관리자", content: "어드민" },
    { name: "msapplication-TileColor", content: "#75a7b5" },
    { name: "theme-color", content: "#ffffff" },
  ];
};

/* export const loader = async () => {
  
  const slowData = new Promise((resolve) => {
    
    setTimeout(() => {
      console.log('start 1 second')
      return resolve("Loaded after 1 seconds")
    }, 1000); // 3초 지연
  });

  return defer({
    data: slowData,
  });
}; */

export default function Index () {
  // const { data } = useLoaderData<typeof loader>();
  // console.log(data)
  return (
    <div style={{
      cursor: `auto`
      // cursor: `auto`
    }}>
    {/* <Suspense fallback={<div className="mt-20 w-full h-dvh bg-red-400">Loading data...</div>}>
      <Await resolve={data}> */}
        {/* {(resolvedData) => resolvedData && <Admin data={data}/>} */}
        <Admin />
      {/* </Await> */}
      {/* <Await resolve={data}>
        {(resolvedData) => <p>{resolvedData}</p>}
      </Await> */}
    {/* </Suspense> */}
    </div>
  )
}