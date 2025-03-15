import { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useNavigation } from "@remix-run/react";
import Works from "~/layout/home/works";
import { getWork, getWorks } from "~/layout/home/works/getData"; 


/* const links: LinksFunction = () => {
  return [
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180", },
    { rel: "icon",type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
    { rel: "icon",type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
    { rel: "manifest", href: "/favicon/site.webmanifest" },
    { rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#5bbad5" },
  ];
}; */


const meta: MetaFunction = () => {
  return [
    { title: "메메지션 : Works" }
  ];
};

const PAGE= 0;
const SIZE= 20;
export async function loader ({
  params,
  request,
}: LoaderFunctionArgs) {
  const {dehydratedState}:any = await getWork(PAGE, SIZE)
  return json({
    dehydratedState,
    params: {
      page: PAGE, size: SIZE
    }
  })
}
export { 
  // getWorks as loader, 
  meta 
}

export default function WorksIndex () {
  
  return (

    <div>
      {/* <div className="mt-44">aaa</div> */}
      <Works />
    </div>
  )
}