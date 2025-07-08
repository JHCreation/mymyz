import { lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";


const Tests= ()=> {
  return (
    <div className="">testts</div>
  )
}

// const Test = lazy(() => import("../layout/home/main/Test.client"));
export default function Index () {
  const [client, setClient]= useState(false)
  useEffect(()=> {
    setClient(true)
  }, [])
  return (
    <div className="pt-20 bg-paper relative z-10">about
      {/* {client && <Tests/>} */}
      {
        // client && 
        <ClientOnly fallback={<div>Loading...</div>}>
        {()=><Tests/>}
        </ClientOnly>
        
      }
      
      {/* <Tests/>  */}
    </div>
  )
}