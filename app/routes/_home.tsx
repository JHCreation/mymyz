import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useState } from "react";
import HomeWrapper from "~/layout/home/HomeWrapper";

import { LoaderFunction, MetaFunction } from "@remix-run/node";
const meta: MetaFunction = () => {
  return [
    { title: "마이즈 | 브랜드 중심 마케팅 · 콘텐츠 · 브랜딩 · 공간 디자인" },
    { name: "description", content: "콘텐츠 기획부터 브랜딩, 마케팅, 공간 디자인까지 — 브랜드의 철학을 시각화하고 전환을 설계하는 통합 마케팅 스튜디오입니다." },
    { name: "keywords", content: "마케팅 대행사, 콘텐츠 전략, 브랜드 마케팅, 브랜딩 디자인, VMD, 공간 기획, 콘텐츠 에디터, 디지털 마케팅, BI 디자인" },
    { name: "msapplication-TileColor", content: "#da532c" },
    { name: "theme-color", content: "#ffffff" },
    { property: "fb:app_id", content: "1981556348739957", },
    { property: "og:type", content: "website", },
    { property: "og:site_name", content: "마이즈", },
    { property: "og:title", content: "브랜드 중심 마케팅 스튜디오 | 마이즈", },
    { property: "og:url", content: "https://www.m-y-z.com/", },
    { property: "og:image", content: "/myz.svg", },
    { property: "og:description", content: "마케팅·콘텐츠·브랜딩·공간 디자인까지, 브랜드에 딱 맞는 전략을 만듭니다.", },
    { property: "twitter:card", content: "summary", },
    { property: "twitter:site", content: "@myz", },
    { property: "twitter:creator", content: "@rainymanson", },
    { property: "twitter:url", content: "https://www.m-y-z.com/", },
    { property: "twitter:title", content: "브랜드 중심 마케팅 스튜디오 | 마이즈", },
    { property: "twitter:description", content: "마케팅·콘텐츠·브랜딩·공간 디자인까지, 브랜드에 딱 맞는 전략을 만듭니다.", },
    { property: "twitter:image", content: "/myz.svg", },
    
    {
      "script:ld+json": {
        "@context": "https://schema.org/",
        "@type": "Organization",
        "url": "https://www.m-y-z.com/",
        "name": "마이즈",
        "alternateName": "myz",
        "description": "콘텐츠 기획, 마케팅 전략, 브랜딩 디자인, 공간 브랜딩 등 브랜드에 최적화된 통합 마케팅 솔루션을 제공합니다.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "서울시 광진구",
          "addressCountry": "KR"
        },
        "contactPoint" : [
          { 
            "@type" : "ContactPoint",
            "contactType" : "customer service",
            "areaServed": "KR",
            "availableLanguage": ["Korean", "English"],
            "contactOption" : "TollFree",
            "email": "corenzomarket@naver.com"
          }
        ],
        "sameAs" : [
          "https://instagram.com/myz",
          "https://www.facebook.com/myz",
        ]
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "마이즈",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "서울",
          "addressCountry": "KR"
        }
      }
    }
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

  return (
    <HomeWrapper init={init} isMobile={isMobile}>
      <Outlet context={{init, setInit}} />
    </HomeWrapper>
  )
}