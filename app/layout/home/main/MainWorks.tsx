import { SplitText } from "@cyriacbr/react-split-text";
import { animated, useInView, useResize, useScroll, useSpring, useSprings, useTrail } from "@react-spring/web";
import { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ScreenContext } from "../Layout1";
import SectionScroll from "./SectionScroll";
import { RisingText } from "./RisingText";
import { Link, Outlet, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import queryOptions from '~/api/works/queryOption';
import {
  HydrationBoundary,
  useQuery,
} from '@tanstack/react-query'
import { SpinerLoading } from "~/components/ui/Loading";
import _ from 'lodash'
import banner_1 from "~/assets/images/banner-2.webp";


export default function MainWorks ({dehydratedState}) {

  return (
    <>
    <HydrationBoundary state={dehydratedState}>
      {/* <Suspense fallback={<div className="bg-red-700 h-dvh-nav w-full">Loading.....</div>}> */}
      <MainWork/>
      {/* </Suspense> */}
    </HydrationBoundary>
    </>
  )
}




const scrolls= new SectionScroll({
  actionOffset: {
    start: 0,
    end: 0
  },
  distanceOffset: {
    start: 0,
    end: 0
  }
})





export function MainWork () {
  const staticUrl= typeof window !== 'undefined' ? window?.ENV?.REMIX_PUBLIC_UPLOAD_PATH : process.env.REMIX_PUBLIC_UPLOAD_PATH;
  const { params, option: { gridStyle} } = useLoaderData<any>()
  const { page, size }= params;

  const domain= typeof window !== 'undefined' ? window.ENV.REMIX_PUBLIC_UPLOAD_PATH : process.env.REMIX_PUBLIC_UPLOAD_PATH;

  
  const { queryKey, queryFn }= queryOptions.list(page, size);
  const query = useQuery({ 
    queryKey, queryFn, 
    staleTime: 30*1000,
    gcTime: 10000,
  })

  const { data, isPending, isLoading }= query
  const {screen, windowSize} = useContext(ScreenContext)
  const containerRef= useRef<HTMLDivElement>(null)
  
  const scroll= useScroll({
    onChange: (result, ctrl, item)=> {
      scrolls.set({
        distanceOffset: {
          start: (-screen.height.get() || scrolls.get("distanceOffset").start),
          end: 0,
        },
      })
      
      const progress= scrolls.getProgress()
      if( !progress ) return
      // const height= scrolls?.position ? scrolls.position.containerDom.height : 0;
      trailApi.start({y: progress})
    }
  })

  useEffect(()=> {
    if( containerRef.current && windowSize ) {
      scrolls.set({ 
        screen: screen,
        container: containerRef.current,
        distanceOffset: {
          start: -(screen.height.get() || windowSize?.height),
          end: 0
        },
      }) 
    }
  }, [containerRef.current, windowSize])




  const [trails, trailApi] = useTrail(
    size+1,
    () => ({
      from: { y: 0 },
      // to: { opacity: 1 },
    }),
    []
  )

  const motion = useCallback((i)=> ({
    y: trails[i].y.to(progress=> {
      return `-${(1+(progress*200))}px`
      return `-${(1+(progress*250))}%`
    })
  }), [])
  
  const style= useRef<any>(null)
  useEffect(()=> {
    console.log(data)
    if( data )
    style.current= data?.list?.map(v=> {
      return [_.random(4, 1)*10, _.random(22, 8)*20, _.random(6, 4)]
    })
  }, [data])
  
  return (
    <>
    
    <div 
      ref={containerRef} 
      className="w-full max-w-container mx-auto mt-52"
      
    >

      <div className="md:flex px-4 md:px-0">
        <animated.div
          style={motion(0)}
          className="font-black text-5xl md:text-[2em] font-type-1 mr-2"
        >
          <RisingText text={'03'} className="font-thin text-stroke-[1px] text-stroke-gray-500 text-stroke-fill-transparent"/>
        </animated.div>
        <div className="w-full">
          <animated.div
            style={motion(0)}
          >
            <div className="text-left max-w-[700px] uppercase font-type-en text-6xl md:text-title font-extrabold leading-none">
              <RisingText
                text={'Works'}
                className=""
              />
          
            </div>
          
          </animated.div>
        </div>
      </div>
      {
        isPending && 
        <SpinerLoading spinClass="" />
      }
      {
        !isPending && 
        <ul className="grid grid-cols-1 md:grid-cols-3 ">
          
          {
            // style.current && 
            data?.list.map((val, i)=> {
              let imgPath
              try {
                imgPath= JSON.parse(val.thumb)
              } catch (error) {
                
              }
              let imgUrl= imgPath ? `${staticUrl}${imgPath[0]}` : banner_1
              
              return (
                <li key={i} className="md:w-full py-2 md:py-5 pr-1 md:pr-3"
                
                  style={{paddingLeft: `${gridStyle[i][0]}px`}}
                  // style={{paddingLeft: `${_.random(4, 1)*10}px`}}
                >

                  
                  <animated.div
                    style={motion((i%3)+1)}
                    className={`overflow-hidden`}
                  >
                    
                    <Link
                      to={`/modal/${val.id}`}
                      /* onClick={e=> {
                        e.preventDefault();
                        setDetail(val)
                        setOpen(true)
                        window.history.pushState(
                          { someData: 'value' },
                          '',
                          `/home-works/${val.id}`
                        );
                        
                      }} */
                      preventScrollReset
                      style={{
                        marginTop: `${gridStyle[i][1]}px`,
                        aspectRatio: `${gridStyle[i][2]} / 6`,
                        // marginTop: `${_.random(22, 8)*20}px`,
                        // aspectRatio: `${_.random(6, 4)} / 6`,
                        /* y: trails[(i%3)+1].y.to(progress=> {
                          return `-${((progress*200)-100)}px`
                        }) */
                      }}
                      className={`block overflow-hidden`}
                    >
                      
                      <animated.img 
                        style={{
                          y: trails[(i%3)+1].y.to(progress=> {
                            return `${-((progress*200)+100)}px`
                          })
                        }}
                        src={imgUrl} 
                        alt="" className="h-[180%] w-full object-cover" 
                        /* style={{
                          marginTop: `${_.random(12, 8)*10}px`,
                          aspectRatio: `${_.random(16, 2)} / 9`
                        }} */
                      />
                    </Link>
                    {/* {
                      val?.title && 
                      <div className="">
                        <RisingText text={val.title} className="font-type-2 text-4xl"/>
                      </div>
                    } */}
                    
                    <TextBox data={val} />
                  </animated.div>
                  
                </li>
              )
          })
          }
            
        </ul>
      }
    </div>
    {/* <MainWorksDetail data={detail} open={open} setOpen={setOpen} /> */}
    </>
  )
}

/* export const MainWorksDetail= ({data, open, setOpen})=> {
  const navigate = useNavigate();
  const {root}= useRootContainer();
  const onClose = ()=> {
    setOpen(false)
    navigate('/', {
      preventScrollReset: true
    })
  }
  console.log(root)
  return (
    root && 
    <Dialog 
      root={root} open={open} 
      setOpen={setOpen} 
      lockScroll={true} 
      animation={false}
      overLayClassName={`bg-transparent`}
      full
      escapeKey
      duration={300}
    >
      <Detail data={data} isLoading={false} open={open} onClose={onClose} />
    </Dialog>
  )
}

export const MainWorksDetailPage= ({ data })=> {
  const [open, setOpen]= useState(true)

  const navigate = useNavigate();
  const onClose = ()=> {
    setOpen(false)
    navigate('/', {
      preventScrollReset: true
    })
  }
  return (
    <MainWorksDetail data={data} open={open} setOpen={setOpen}/>
  )
} */




const TextBox= ({ data })=> {
  const [viewRef, isView]= useInView({
    once: true
  })
  const spring= useSpring({
    from: { x: '-100%' },
    to: { x: isView ? '0': '-100%' },
  })

  
  return (
    <div className="">
      <div className="mt-4">
        
      </div>
      {/* <div className="font-type-2 text-4xl"> */}
        
      {/* </div> */}

      <div className="font-suite text-2xl md:text-6xl mt-3 break-keep">
        <RisingText text={data.title} className="break-keep" textClassName="break-keep"/>
        {/* <RisingText text={'design'} className=""/> */}
      </div>

      <animated.div
        ref={viewRef}
        style={{ 
          x: spring.x 
        }}
        className={'w-full h-[.8px] my-4 bg-black'}
      />
    </div>
  )
}

