import { Outlet } from "@remix-run/react";
import Aside from "~/layout/admin/Aside";
import AdminWrapper from "~/layout/admin/Wrapper";


export default function AdminLayout () {
    return (
        <>
        <AdminWrapper>
            <Outlet />
        </AdminWrapper>
        </>
    )
}