import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { useLogState } from "~/store/store";
import AuthGuard from "~/components/auth/AuthGuard";
import { LoadingsFull } from "~/layout/admin/loading/AdminLoading";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const domain = url.origin;
  return { domain };
}

export default function Index () {
  const { domain }:any = useLoaderData<typeof loader>();
  return (
    <>
    <div className="bg-base-100">
      <ClientOnly fallback={<LoadingsFull/>}>
        {()=> <AuthGuard domain={domain} >
          <Outlet />
        </AuthGuard>}
      </ClientOnly>
    </div>
    </>
  )
}

const Loading= ()=> <div className="w-full h-dvh flex items-center justify-center bg-transparent">Loading....................</div>