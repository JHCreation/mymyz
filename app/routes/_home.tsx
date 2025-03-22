import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useState } from "react";
import HomeWrapper from "~/layout/home/HomeWrapper";

import { LoaderFunction, MetaFunction } from "@remix-run/node";
/* 
<!-- Open Graph -->
    <meta property="fb:app_id" content="1981556348739957" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="이지켐텍" />
    <meta property="og:title" content="이지켐텍" />
    <meta property="og:description" content="이지켐텍" />
    <meta property="og:url" content="https://www.ezchemtech.com/" />
    <meta property="og:image" content="/img/logo/logo-opengraph.svg" />
    <!-- Open Graph -->
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@rainymanson" />
    <meta name="twitter:creator" content="@rainymanson" />
    <meta name="twitter:url" content="https://www.ezchemtech.com/">
    <meta name="twitter:title" content="이지켐텍">
    <meta name="twitter:description" content="이지켐텍">
    <meta name="twitter:image" content="/img/logo/logo-opengraph.svg">
    <!-- Twitter Card -->
     */
const meta: MetaFunction = () => {
  return [
    { title: "마이즈" },
    { name: "확실한 성공의 길을 제시합니다.", content: "마이즈와 함께 하세요!" },
    { name: "msapplication-TileColor", content: "#da532c" },
    { name: "theme-color", content: "#ffffff" },
    { property: "fb:app_id", content: "1981556348739957", },
    { property: "og:type", content: "website", },
    { property: "og:site_name", content: "마이즈", },
    { property: "og:title", content: "마이즈", },
    { property: "og:url", content: "https://www.m-y-z.com/", },
    { property: "og:image", content: "/myz.svg", },
    { property: "og:description", content: "확실한 성공의 길을 제시합니다. 마이즈와 함께 하세요!", },
    { property: "twitter:card", content: "summary", },
    { property: "twitter:site", content: "@myz", },
    { property: "twitter:creator", content: "@rainymanson", },
    { property: "twitter:url", content: "https://www.m-y-z.com/", },
    { property: "twitter:title", content: "마이즈", },
    { property: "twitter:description", content: "확실한 성공의 길을 제시합니다. 마이즈와 함께 하세요!", },
    { property: "twitter:image", content: "/myz.svg", },
    
    {
      "script:ld+json": {
        "@context": "https://schema.org/",
        "@type": "Organization",
        "url": "https://www.m-y-z.com/",
        "name": "마이즈",
        "alternateName": "마이즈",
        "description": "브랜딩을 디자인하다.",
        "contactPoint" : [
          { 
            "@type" : "ContactPoint",
            "contactType" : "customer service",
            "contactOption" : "TollFree",
            "email": "corenzomarket@naver.com"
          }
        ],
        "sameAs" : [
          "https://instagram.com/myz",
          "https://www.facebook.com/myz",
        ],
        "author": {
          "@type": "Person",
          "name": "Albert Yoo"
        }
      },
    },
    
  ];
};

export { meta }

export const loader: LoaderFunction = async ({ request }) => {
  const userAgent = request.headers.get("User-Agent") || "";
  // const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  const isMobile = /Android|iPhone|iPad|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile/i.test(userAgent);

  return { isMobile };
};


export default function HomeLayout () {
  const { isMobile } = useLoaderData<any>()
  
  const location= useLocation()
  const { pathname }= location;
  const [init, setInit]= useState(pathname == '/' ? false : true)
  // console.log(init, pathname)

  return (
    <HomeWrapper init={init} isMobile={isMobile}>
      <Outlet context={{init, setInit}} />
    </HomeWrapper>
  )
}