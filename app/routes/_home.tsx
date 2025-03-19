import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useState } from "react";
import HomeWrapper from "~/layout/home/HomeWrapper";

import { LoaderFunction, MetaFunction } from "@remix-run/node";

const meta: MetaFunction = () => {
  return [
    { title: "마이즈" },
    { name: "확실한 성공의 길을 제시합니다.", content: "마이즈와함께 하세요!" },
    { name: "msapplication-TileColor", content: "#da532c" },
    { name: "theme-color", content: "#ffffff" },
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