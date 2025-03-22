import { Link, Outlet, useLoaderData, useSearchParams } from "@remix-run/react"
import { HydrationBoundary, useQuery } from "@tanstack/react-query"
import { getWorks, homeGetParams, homeQuery } from "./getData"
import queryOptions from "~/api/works/queryOption"


export default function Index () {
  const { dehydratedState, params } = useLoaderData<any>()
  // console.log(dehydratedState)
  return (
    <>
    <HydrationBoundary state={dehydratedState}>
      {/* <Suspense fallback={<div className="bg-red-700 h-dvh-nav w-full">Loading.....</div>}> */}
      <Works params={params} />
      {/* </Suspense> */}
    </HydrationBoundary>
    </>
  )
}


const Works= ({params})=> {
  const staticUrl= typeof window !== 'undefined' ? window?.ENV?.REMIX_PUBLIC_UPLOAD_PATH : process.env.REMIX_PUBLIC_UPLOAD_PATH;
  const [searchParams, setSearchParams] = useSearchParams();
  // const { page, size }= homeGetParams({ searchParams: searchParams })
  // const [page, setPage]= useState(0)
  // const [size, setSize]= useState(9)
  const { queryKey, queryFn }= queryOptions.list(params.page, params.size)
  const query = useQuery({ 
    queryKey, queryFn, 
    staleTime: 30*1000,
    gcTime: 10000,
  })
  const { data, isPending, isLoading }= query
  return (
    <div className="mt-nav bg-paper relative z-10">
      {
        data && 
        <>
        <div className="max-w-container mx-auto p-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 gap-4">
          {
            data?.list.map(d=> {
              let imgPath
              try {
                imgPath= JSON.parse(d.thumb)
              } catch (error) {
                
              }
              let imgUrl= imgPath ? `${staticUrl}${imgPath}` : ''
              return (
                <Link 
                  to={`./${d.id}`} key={d.id} 
                  preventScrollReset={true}
                  className="border p-2 min-h-[300px] mt-10"
                >
                  {/* <p className="text-xs text-accent-content ">
                    {d.key}
                  </p> */}
                  <img src={imgUrl} alt=""  className="aspect-square object-cover"/>
                  {/* <div className="leading-none text-5xl font-bold">{d.id}</div> */}
                  <div className="leading-none mt-4 text-4xl md:text-6xl">{d.title}</div>
                    
                </Link>
              )
            })
          }
        </div>
        
        </>
      }
      <Outlet />
      
    </div>
  )
}