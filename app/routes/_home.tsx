import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useState } from "react";
import HomeWrapper from "~/layout/home/HomeWrapper";

import { LoaderFunction } from "@remix-run/node";

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