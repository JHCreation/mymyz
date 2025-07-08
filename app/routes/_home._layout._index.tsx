import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { getCategory, homeGetParams, homeQuery } from "../layout/home/getData";
// import AnimatedCursor from "react-animated-cursor";

import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno
import Layout1 from "~/layout/home/Layout1";
import HomeWrapper from "~/layout/home/HomeWrapper";
import { Outlet, useLoaderData } from "@remix-run/react";
// import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query";
import { getWorks } from "~/layout/home/works/getData"; 


const links: LinksFunction = () => {
  return [
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180", },
    { rel: "icon",type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
    { rel: "icon",type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
    { rel: "manifest", href: "/favicon/site.webmanifest" },
    { rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#5bbad5" },
  ];
};


// const meta: MetaFunction = () => {
//   return [
//     { title: "메메지션" },
//     { name: "확실한 성공의 길을 제시합니다.", content: "메메지션과 함께 하세요!" },
//     { name: "msapplication-TileColor", content: "#da532c" },
//     { name: "theme-color", content: "#ffffff" },
//   ];
// };
/* export { 
  getCategory as loader, 
  links, meta 
} */

export { 
  getWorks as loader, 
  links, 
  // meta 
}

export const clientLoader = async ({ params, serverLoader }) => {
  return {}
};

export default function Index() {
  const { dehydratedState } = useLoaderData<typeof getWorks>()
  // console.log(dehydratedState)
  return (
    <></>
  );
}