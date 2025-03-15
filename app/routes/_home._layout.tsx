import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { getCategory, homeGetParams, homeQuery } from "../layout/home/getData";
// import AnimatedCursor from "react-animated-cursor";

import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno
import HomeWrapper from "~/layout/home/HomeWrapper";
import { json, Outlet, useLoaderData, useLocation, useOutletContext } from "@remix-run/react";
// import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query";
import Layout1 from "~/layout/home/Layout1";
import { getWork, getWorks } from "~/layout/home/works/getData";
import _ from 'lodash'
import { useState } from "react";
const links: LinksFunction = () => {
  return [
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180", },
    { rel: "icon",type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
    { rel: "icon",type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
    { rel: "manifest", href: "/favicon/site.webmanifest" },
    { rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#5bbad5" },
  ];
};


const meta: MetaFunction = () => {
  return [
    { title: "메메지션" },
    { name: "확실한 성공의 길을 제시합니다.", content: "메메지션과 함께 하세요!" },
    { name: "msapplication-TileColor", content: "#da532c" },
    { name: "theme-color", content: "#ffffff" },
  ];
};

const PAGE= 0;
const SIZE= 9;
const gridStyle= [...new Array(SIZE)]?.map(v=> {
  return [_.random(4, 1)*10, _.random(22, 8)*20, _.random(6, 4)]
})
export async function loader ({
  params,
  request,
}: LoaderFunctionArgs) {
  const {dehydratedState}:any = await getWork(PAGE, SIZE)
  return {
    dehydratedState,
    params: {
      page: PAGE, size: SIZE
    },
    option: {
      gridStyle
    }
  }
}
/* const work= getWork(0,9);
export { 
  work as loader, 
  links, meta 
} */

export const clientLoader = async ({ params, serverLoader }) => {
  console.log('client Loader!!!')
  return {
    params: {
      page: PAGE, size: SIZE
    },
    option: {
      gridStyle
    }
  }
};


const exception= [
  'admin',
]
export default function Layout() {
  const { dehydratedState } = useLoaderData<any>()

  const location= useLocation()
  const { pathname }= location;
  const except= exception.indexOf(pathname.split('/')[1])
  const { init, setInit } = useOutletContext<any>();
  
  return (
    <>
      {/* { except != -1 && <Outlet /> } */}
      {/* { except == -1 &&  */}
        <>
          <Outlet />
          <Layout1 dehydratedState={dehydratedState} init={init} setInit={setInit}/>
        </>
      {/* } */}
      </>
    
  );
}