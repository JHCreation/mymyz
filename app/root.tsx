import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";

import "./tailwind.css";

import dotenv from "dotenv";
import path from "path";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import { useCategoryState, useEnv, useMediaQueryState } from "./store/store";
import _ from 'lodash'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


/* export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
]; */

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
    // { title: "마이즈" },
    // { name: "확실한 성공의 길을 제시합니다.", content: "마이즈와 함께 하세요!" },
    { name: "msapplication-TileColor", content: "#da532c" },
    { name: "theme-color", content: "#ffffff" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "myz",
        url: "https://www.myz.com",
      },
    },
  ];
};
export { links, meta }


const exception= [
  'admin',
]

export async function loader() {
  const env = process.env.NODE_ENV;
  dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}.local`) });
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  dotenv.config(); // 기본 .env 파일
  // console.log('env:',env, 'url:', process.env)
  return {
    ENV: {
      SOME_SECRET: process.env.REMIX_PUBLIC_SOME_SECRET,
      REMIX_PUBLIC_API_URL: process.env.REMIX_PUBLIC_API_URL,
      REMIX_PUBLIC_UPLOAD_PATH: process.env.REMIX_PUBLIC_UPLOAD_PATH,
    },
  };
}


export function Layout({ children }: { children: React.ReactNode }) {

  const env = useLoaderData<typeof loader>();
  // console.log('Layout', env)
  const { setEnv }= useEnv()
  useEffect(()=> {
    if( env ) setEnv(env)
  }, [env])
  
  const location= useLocation()
  const { pathname }= location;
  // const except= exception.indexOf(pathname.split('/')[1])

  const mediaQuery= useMediaQueryState()
  const xs = useMediaQuery({ minWidth: 0 })
  const sm = useMediaQuery({ minWidth: 480 })
  const md = useMediaQuery({ minWidth: 860 })
  const lg = useMediaQuery({ minWidth: 1224 })
  const xl = useMediaQuery({ minWidth: 2200 })

  useEffect(()=> {
    // console.log('mediaQuery::',xs, sm, md, lg, xl)
    mediaQuery.setMediaQuery({ xs, sm, md, lg, xl })
  }, [xs, sm, md, lg, xl])

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Josefin+Sans:wght@100&display=swap" rel="stylesheet"></link>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              env.ENV
            )}`,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  )
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
