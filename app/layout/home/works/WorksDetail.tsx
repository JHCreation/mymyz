import Dialog from "~/components/ui/Dialog"
import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, useState } from "react"
import { useRootContainer, useRootLenis } from "~/store/store"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { animated, easings, useScroll, useSpring } from "@react-spring/web";
import _ from "lodash"
import { getWorksDetail } from "./getData"
import { HydrationBoundary, useQuery } from "@tanstack/react-query"
import queryOptions from "~/api/works/queryOption"
import { Loading } from "~/components/ui/Loading"
import { IconX } from "@tabler/icons-react"
import { MagneticCursor } from "~/components/cursor/MagneticCursor"
import DOMPurify from 'dompurify';
import 'quill/dist/quill.snow.css'; // 이 import는 클라이언트 사이드에서만 실행됩니다.
import '~/components/inputs/quill-style.css'

export default function WorksDetail ({ id, duration, closeCb }) {
  const { dehydratedState } = useLoaderData<typeof getWorksDetail>()

  const [isClient, setIsClient]= useState(false)
  const {root}= useRootContainer();

  const closing= ()=> {
    let time
    time= setTimeout(e=> {
      closeCb()
      clearTimeout(time)
    }, duration)
  }

  const { rootLenis }= useRootLenis()
  useEffect(()=> {
    rootLenis?.stop()
    setIsClient(true)
    return ()=> {
      console.log('close?')
      rootLenis?.start()
    }
  }, [rootLenis])

  const navigate = useNavigate()
  
  const [open, setOpen]= useState(true)
  const onClose= ()=> {
    setOpen(false)
    closing()
  }

  const setOn= (open)=> {
    setOpen(open)
    if( !open ) closing()
    return open
  }

  useEffect(()=> {
    setOpen(true)
  }, [id])
  

  if( !isClient ) return <HydrationBoundary state={dehydratedState}>
    <div className="h-0"><Details open={open} setOpen={setOpen} id={id} onClose={onClose} /></div>
  </HydrationBoundary>
  
  // console.log(open)
  return (
    <>
    <HydrationBoundary state={dehydratedState}>

    <Dialog 
      root={root} open={open} 
      setOpen={setOn} 
      lockScroll={true} 
      animation={false}
      overLayClassName={`bg-transparent`}
      full
      escapeKey
      duration={duration}
    >
      <Details open={open} id={id} setOpen={setOpen} onClose={onClose} isClient={true} />
    </Dialog>
    </HydrationBoundary>
    </>
  )
}




const Details= ({ id, open, setOpen, onClose, isClient }:any)=> {
  const { queryKey, queryFn }= queryOptions.item(id)

  const query= useQuery({ 
    queryKey, queryFn,
    staleTime: 30*1000,
    gcTime: 100000,
  } );
  const { data, isPending, isLoading }= query
  
  return  (
    data && 
    <Detail data={data} isLoading={isLoading} open={open} onClose={onClose} isClient={isClient} />
  )
}

export const Detail = ({ data:res, isLoading, open, onClose, isClient })=> {

  const data= _.clone(res);
  // const cleanContent= DOMPurify.sanitize(res?.content);
  if( isClient ) {
    const cleanContent = DOMPurify.sanitize(res?.content, { 
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
      USE_PROFILES: { html: true } 
    });
    data.content= cleanContent;
  }
  // if( data ) data.content= cleanContent;
  return  (
    <div className="flex w-full justify-center overflow-hidden relative">
      
      <BgAni onClose={onClose} open={open} />
      <ContAni open={open}>
        
        <div className="relative h-dvh py-10 w-dvw px-2">
          <div className="w-full max-w-[calc(100%-64px)] absolute top-10 left-1/2 -translate-x-1/2 z-50">
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
              <MagneticCursor className="btn btn-circle custom-hover" onClick={onClose}>
                <IconX size={20} className="font-thin"/>
              </MagneticCursor>
            </div>
          </div>
          <ReactLenis className="modal-box- overflow-y-auto overscroll-contain rounded-none w-full max-w-[800px]- scale-100 max-h-full bg-transparent shadow-none p-0 mx-auto pointer-events-auto my-auto h-full" >
          
            {/* <div className="bg-base-100"></div> */}
            <div className="bg-base-100 w-full min-h-[calc(100dvh-5rem)] relative mx-auto ">
          
              {
                isLoading &&
                <div className="absolute w-full h-full flex items-center justify-center"><Loading/></div>
              }
              <div className="p-5 md:p-10 text-[13px] md:text-[16px]">
                <div className="">{data?.id}</div>
                <div className="">{data?.key}</div>
                <div className="text-3xl">{data?.name}</div>
                <div className="">{data?.title}</div>
                <div className="ql-editor" 
                  dangerouslySetInnerHTML={{
                  __html: data?.content }}
                ></div>
                <div className="">{data?.create_date}</div>
              </div>
          
            </div>
          
          </ReactLenis>
        </div>
      </ContAni>
    </div>
  )
}


const ContAni= ({children, open})=> {
  useEffect(()=> {
    if( !open ) {
      api.start({
        from: {
          opacity: 1,
          y: '0%',
        },
        to: [
          // { opacity: 0, y: '0%', config: { duration: 250, },},
          // { opacity: 1, y: '.1%', config: { duration: 250, }, delay: 500},
          { 
            opacity:  0, 
            y: '10%', 
            config: { duration: 200, },
          },
        ],
        delay: 0
      })
    }
    
  }, [open])
  const [styles_1, api] = useSpring((key)=> ({
    from: {
      opacity: 0,
      y: '10%',
      // config: { duration: 350, },
    },
    to: [
      // { opacity: 0, y: '0%', config: { duration: 250, },},
      // { opacity: 1, y: '.1%', config: { duration: 250, }, delay: 500},
      { 
        opacity: 1, 
        y: '0%', 
        config: { duration: 200, }, delay: 0
      },
      // { opacity: 0, y: '0%', config: { duration: 200, },},
    ],
    delay: 600
  }) )

  // console.log('styles_1', styles_1)

  return (

    <animated.div
      style={styles_1} 
      className={` `}
    >
      {children}
    </animated.div>
  )
}


const BgAni= ({ onClose, open })=> {
  useEffect(()=> {
    if( !open ) {
      api.start({
        from : { scaleY: 1, transformOrigin: '50% 0%', opacity: .3 },
        to: [
          { scaleY: 1, transformOrigin: '50% 100%', opacity: .3, config: { duration: 100 } },
          { scaleY: 0, transformOrigin: '50% 100%', opacity: 1, config: { duration: 300 } },
        ],
      })
    }
  }, [open])

  const [styles, api] = useSpring(()=> ({
    config:{
      easing: easings.easeInCubic,
    },
    from : { 
      scaleY: 0, transformOrigin: '50% 100%', opacity: 1, 
      // backgroundColor: '#000', 
    },
    to: [
      { scaleY: 1, transformOrigin: '50% 100%', opacity: .3, config: { duration: 500 } },
      { 
        scaleY: 1, transformOrigin: '50% 0%', opacity: .3, 
        // backgroundColor: '#fff',
        config: { duration: 300 } 
      },
    ],
    
  }) )
  const easing= {
    y: easings.easeInBounce,
    opacity: easings.easeInOutBounce,
  }
  

  return (
    <>
    <animated.div
      onClick={onClose}
      style={styles}
      className={`absolute top-0 left-0 bg-black w-full min-h-dvh h-full`}
    >
    </animated.div>
    </>
  )
}