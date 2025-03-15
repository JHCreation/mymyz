import { defer, useLoaderData } from "@remix-run/react";
import AdminWorks from "~/layout/admin/works";




export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function AdminWorksIndex () {
  return (
    <AdminWorks />
  )
}