import { Outlet, useLocation } from "@remix-run/react";
import { useState } from "react";
import HomeWrapper from "~/layout/home/HomeWrapper";

export default function HomeLayout () {
  const location= useLocation()
  const { pathname }= location;
  const [init, setInit]= useState(pathname == '/' ? false : true)
  // console.log(init, pathname)

  return (
    <HomeWrapper init={init}>
      <Outlet context={{init, setInit}} />
    </HomeWrapper>
  )
}