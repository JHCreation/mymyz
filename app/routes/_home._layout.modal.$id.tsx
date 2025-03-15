import { Await, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { Suspense } from "react";

import WorksDetail from "~/layout/home/works/WorksDetail";
import { getWorksDetail } from "~/layout/home/works/getData"; 


export { getWorksDetail as loader }
export const clientLoader = async ({ params, serverLoader }) => {
  return {}
};

export default function Modal() {
  const promise = useLoaderData<typeof getWorksDetail>()
  const { dehydratedState } = promise
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate('/', {
    preventScrollReset: true
  })
  console.log('works dehydratedState', dehydratedState, id)
  return (
    <>
    {/* <Suspense fallback={<div className="fixed top-0 left-0 w-full h-full bg-white">Loading...</div>}>
      <Await resolve={promise}> */}
        <WorksDetail 
          id={id} duration={300} 
          closeCb={goBack}
        />
      {/* </Await>
    </Suspense> */}
    </>
  );
}