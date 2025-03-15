import { LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate, useParams } from "@remix-run/react";
import { Suspense } from "react";
import WorksDetail from "~/layout/home/works/WorksDetail";
import { getWorksDetail } from "~/layout/home/works/getData"; 


export { getWorksDetail as loader}
export const clientLoader = async ({ params, serverLoader }) => {
  return {}
};
export default function WorkIdIndex () {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate('/works', {
    preventScrollReset: true
  })
  return (
    <WorksDetail id={id} duration={500} closeCb={goBack}/>
  )
}